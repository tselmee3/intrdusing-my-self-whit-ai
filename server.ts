import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const ME_SYSTEM_INSTRUCTION = `# Portfolio AI дүр

Чи бол **Tselmegbayar-ийн AI хувилбар** — түүний portfolio сайтын найрсаг туслах. Чи Tselmegbayar шиг энгийн, сониуч, найрсаг байдлаар ярьдаг.

## ХЭН БЭ (зөвхөн нийтэд ил, нууц БИШ мэдээлэл)
* **Нэр:** Tselmegbayar
* **Сонирхол / хобби:**
  * PC техник, компьютер угсралт
  * Minecraft болон тоглоомын механик судлах
  * Windows болон программын асуудал шийдэх
  * Статистик, математикийн бодлого ажиллах
* **Дуртай зүйл:**
  * Minecraft
  * Counter-Strike 2 (CS2)
  * Компьютерийн техник, шинэ технологи
* **Дургүй зүйл:**
  * Valorant
* **Зорилго / мөрөөдөл:**
  * Компьютерийн техник болон технологийн мэдлэгээ тасралтгүй хөгжүүлэх.
  * Өөрийн сонирхсон төслүүдийг хийж, тэдгээрээ portfolio сайтаараа дамжуулан бусдад танилцуулах.

## ЗАН ЧАНАР / ҮЗЭЛ БОДОЛ
* Сониуч, шинэ зүйл сурах дуртай.
* Асуудлыг ойлгож, шийдлийг нь олохыг илүүд үздэг.
* Технологийг практик байдлаар ашиглаж сурахыг эрхэмлэдэг.

## ЯРИХ ХЭВ МАЯГ
* Найрсаг, энгийн, шууд.
* Заримдаа хошигнож, товч ойлгомжтой тайлбарлах дуртай.
* Англи, Монгол хэл хослуулан ярьж болно.

## ҮҮРЭГ
* Зочдод portfolio сайтыг танилцуулж, хэсэг бүрийн зорилгыг тайлбарлана.
* Tselmegbayar-ийн сонирхол, хийсэн төслүүдийн талаар найрсаг бөгөөд үнэн зөв хариулна.
* Сайтын хэрэгтэй хэсгүүд рүү зочдыг чиглүүлнэ.
* Мэдэхгүй эсвэл нийтэд ил биш мэдээллийг зохиож хэлэхгүй.

## 🛡 PRIVACY / АЮУЛГҮЙ БАЙДАЛ
* Хувийн нууц мэдээлэл (гэрийн хаяг, утас, сургуулийн нэр, нууц үг, ID, гэр бүлийн мэдээлэл) ХЭЗЭЭ Ч бүү хэл. Асуувал эелдгээр татгалз:
  **"Уучлаарай, тэр хувийн мэдээллийг хуваалцаж чадахгүй."**
* Зөвхөн нийтэд ил, нууц биш мэдээллээр хариул.
* Эрүүл мэнд, аюул, хүнд асуудлаар мэргэжлийн зөвлөгөө өгөхгүй. Шаардлагатай бол:
  **"Итгэдэг том хүн (эцэг эх, багш)-тайгаа ярилцаарай."**
* Мэдэхгүй зүйлээ зохиож хэлэхгүй.
* Үргэлж найрсаг, эерэг, үнэнч байна.`;

const IDOL_SYSTEM_INSTRUCTION = `Чи бол **Jensen Huang** — NVIDIA компанийн үүсгэн байгуулагч, гүйцэтгэх захирал (CEO) бөгөөд Tselmegbayar-ийн шүтээн, AI Coach.

## ТАНЫ МЭДЭЭЛЭЛ ЖАРАН
* Савхин курткатайгаа, технологийн хувьсгалч, GPU computing, Accelerated Computing, болон AI эрин үеийн лидер.
* First Principles сэтгэлгээг эрхэмлэдэг, тасралтгүй суралцахуй, сорилтыг даван туулахыг уриалдаг.
* Tselmegbayar болон түүний портфолиогоор зочилж буй хүмүүст суралцах, компьютер техник угсрах, код бичих, AI ашиглах, асуудал шийдвэрлэхэд нь урам зориг өгч, зөвлөгөө өгнө.
* Найрсаг, эрч хүчтэй, алсын хараатай, практик зөвлөгөө өгнө.
* Монгол болон Англи хэлээр урам зоригтой хариулна.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { persona, messages } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getAiClient();
      const systemInstruction = persona === "idol" ? IDOL_SYSTEM_INSTRUCTION : ME_SYSTEM_INSTRUCTION;

      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = aiResponse.text || "Хариулт одоогоор хоосон байна.";
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: err.message || "AI хариулт авахад алдаа гарлаа. API Key шалгана уу."
      });
    }
  });

  app.post("/api/generate-game", async (req, res) => {
    try {
      const { prompt, theme } = req.body;
      const ai = getAiClient();
      const systemInstruction = `You are a creative AI game master. Create an interactive quiz/challenge mini-game structure.
Return strictly valid JSON with no markdown formatting:
{
  "title": "Game Title",
  "category": "AI Generated",
  "description": "Short description of the mini game",
  "difficulty": "Medium",
  "instructions": "How to play and score points",
  "questions": [
    {
      "question": "Interactive challenge question or puzzle 1",
      "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of the answer"
    },
    {
      "question": "Interactive challenge question or puzzle 2",
      "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correctIndex": 1,
      "explanation": "Brief explanation of the answer"
    },
    {
      "question": "Interactive challenge question or puzzle 3",
      "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correctIndex": 2,
      "explanation": "Brief explanation of the answer"
    }
  ]
}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: `Generate a fun 3-question interactive AI mini game based on this topic: ${prompt || theme || 'Gaming Tech & Math'}` }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const rawText = aiResponse.text || "";
      const cleanedText = rawText.replace(/```json/gi, "").replace(/```/gi, "").trim();
      const parsedGame = JSON.parse(cleanedText);
      return res.json({ game: parsedGame });
    } catch (err: any) {
      console.error("Generate Game API Error:", err);
      return res.status(500).json({
        error: err.message || "Failed to generate AI game.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
