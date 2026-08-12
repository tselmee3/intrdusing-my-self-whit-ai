import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || "(default)"
);

export interface AnswerRecord {
  questionId: number;
  heroName: string;
  animeTitle: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface ScoreDoc {
  id?: string;
  playerName: string;
  score: number;
  gameType: string;
  maxStreak?: number;
  answers: AnswerRecord[];
  createdAt?: any;
}

export async function saveGameScore(
  playerName: string,
  score: number,
  answers: AnswerRecord[],
  maxStreak: number = 0,
  gameType: string = "Anime Hero Quiz"
) {
  try {
    const scoresRef = collection(db, "scores");
    const docRef = await addDoc(scoresRef, {
      playerName: playerName.trim() || "Тоглогч",
      score,
      gameType,
      maxStreak,
      answers,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving score to Firestore:", error);
    throw error;
  }
}

export async function fetchTopScores(limitCount: number = 10): Promise<ScoreDoc[]> {
  try {
    const scoresRef = collection(db, "scores");
    // Query ordered by score descending, limited to top 10 by default
    const q = query(scoresRef, orderBy("score", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const scores: ScoreDoc[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        playerName: data.playerName || "Тоглогч",
        score: typeof data.score === "number" ? data.score : 0,
        gameType: data.gameType || "Anime Hero Quiz",
        maxStreak: data.maxStreak || 0,
        answers: Array.isArray(data.answers) ? data.answers : [],
        createdAt: data.createdAt,
      });
    });

    // Ensure client-side sort high to low as extra guarantee
    scores.sort((a, b) => b.score - a.score);

    return scores.slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching top scores from Firestore:", error);
    return [];
  }
}
