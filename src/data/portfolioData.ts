import { Project, PcSpec } from "../types";

export const PORTFOLIO_INFO = {
  name: "Tselmegbayar",
  shortName: "Tselmegbayar",
  title: "PC Hardware & Tech Enthusiast | Game Mechanics & Math Explorer",
  bio: "Компьютер угсралт, PC техник, програм хангамжийн асуудал шийдэх, Minecraft тоглоомын механик судлах, математик ба статистикийн бодлого ажиллахад сонирхолтой технологид дуртай суралцагч.",
  location: "Ulaanbaatar, Mongolia",
  hobbies: [
    { title: "PC техник & Угсралт", description: "Компьютерийн эд ангиудын тохироо, хөргөлт, гүйцэтгэлийг хамгийн өндөр түвшинд тааруулах" },
    { title: "Minecraft & Механик", description: "Redstone систем, сервер тохиргоо болон тоглоомын гүнзгий механик судлах" },
    { title: "CS2 & Тамирчдын техник", description: "Counter-Strike 2 тактик, frame rate болон систем latency тохиргоо" },
    { title: "Статистик & Математик", description: "Логик сэтгэлгээ ба математик алгоритм бодлого бодох" },
    { title: "Windows & ПО Шийдэл", description: "Системийн алдаа засах, драйвер ба OS оптимизаци хийх" }
  ],
  likes: ["Minecraft", "Counter-Strike 2 (CS2)", "PC Hardware & New Tech", "Math & Logic Problems"],
  dislikes: ["Valorant"],
  socials: {
    github: "https://github.com",
    email: "tselmeegbayarolzeesahan@gmail.com",
  }
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "1",
    title: "PC Build Configurator & Performance Analyzer",
    category: "Hardware",
    description: "Компьютерийн эд ангиудын тэжээл (PSU), CPU/GPU bottleneck, хөргөлтийн тохироог тооцоолж, хэрэглэгчид хамгийн сайн систем санал болгох веб апп.",
    tags: ["PC Hardware", "Bottleneck Calculator", "Hardware Synergy", "TypeScript"],
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "2",
    title: "Minecraft Redstone Logic & Server Mechanics",
    category: "Gaming & Mechanics",
    description: "Minecraft тоглоомын Redstone логик хаалтууд, авто фермийн таймерууд болон серверийн tick-rate гүйцэтгэлийн шинжилгээний заавар.",
    tags: ["Minecraft", "Redstone Circuits", "Server Optimization", "Game Logic"],
    image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "3",
    title: "Windows System Tuning & Driver Diagnostics",
    category: "Software & OS",
    description: "Windows үйлдлийн системийн latency-г бууруулах, хэрэгцээгүй фоны процессуудыг зохицуулах болон драйверын асуудлыг оношлох скрипт, зааварчилгаа.",
    tags: ["Windows 11", "System Optimization", "Latency Tuning", "Powershell"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "4",
    title: "Statistical Data & Math Problem Visualizer",
    category: "Math & Stats",
    description: "Математикийн функцийн графикууд, статистик магадлалын тархалтыг интерактив байдлаар дүрслэн харуулдаг визуалайзер төсөл.",
    tags: ["Statistics", "Mathematics", "Data Visualization", "Algorithms"],
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    featured: true
  }
];

export const PC_SPECS: PcSpec[] = [
  { component: "Processor (CPU)", model: "Intel Core i7 / AMD Ryzen 7 Series", iconName: "Cpu", detail: "Өндөр частоттай олон цөмт процессор, олон төрлийн даалгавар ба тоглоомд зориулагдсан" },
  { component: "Graphics (GPU)", model: "NVIDIA GeForce RTX Series (NVIDIA Powered)", iconName: "Zap", detail: "Ray Tracing, DLSS 3 болон AI хурдасгууртай графикийн картаар тоноглогдсон" },
  { component: "Memory (RAM)", model: "32GB DDR5 Dual Channel High Speed", iconName: "Server", detail: "Код бичих, систем тохируулах ба олон апп нэгэн зэрэг ажиллахад хангалттай багтаамж" },
  { component: "Storage", model: "2TB NVMe M.2 Gen4 High-Speed SSD", iconName: "HardDrive", detail: "7000MB/s хүртэлх унших хурдтай, хурдан ачаалалт" },
  { component: "Mainboard", model: "Custom ATX Gaming Motherboard", iconName: "Layers", detail: "Бат бөх VRM тэжээлийн систем ба PCIe 4.0/5.0 дэмжлэг" },
  { component: "Cooling & PSU", model: "240mm Liquid Cooler & 80+ Gold Power Supply", iconName: "Wind", detail: "Тогтвортой дулаан зайлуулалт болон цэвэр тэжээл" }
];

export const IDOL_INFO = {
  name: "Jensen Huang",
  title: "CEO & Founder of NVIDIA | Tech Visionary",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  quote: "The more you learn, the more you realize how much more there is to learn. First-principles thinking is key.",
  highlights: [
    "Pioneer of GPU Computing & Accelerated Computing",
    "Known for iconic black leather jacket & charismatic leadership",
    "Built NVIDIA from graphics chips to the engine of global AI Revolution",
    "Advocate for curiosity, grit, and relentless continuous learning"
  ]
};
