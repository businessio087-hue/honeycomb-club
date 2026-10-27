export type Category = "Wellness" | "Cosmetics" | "Smokeables" | "Edibles";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  accent: string;
};

const assetByPath: Record<string, string> = {
  "2023/04/Adler-Zero-Hemp-Smokes-300x300.jpeg":
    "/assets/products/01-Adler-Zero-Hemp-Smokes-300x300.jpeg",
  "2022/12/Bran-Rusks-300x300.jpeg":
    "/assets/products/02-Bran-Rusks-300x300.jpeg",
  "2022/12/Buttermilk-Rusks-300x300.jpeg":
    "/assets/products/03-Buttermilk-Rusks-300x300.jpeg",
  "2022/12/CBD-flower-Pre-Rolls-300x300.jpeg":
    "/assets/products/04-CBD-flower-Pre-Rolls-300x300.jpeg",
  "2022/12/CBD-flower-1-300x300.png":
    "/assets/products/05-CBD-flower-1-300x300.png",
  "2023/04/CBD-gummies-300x300.jpeg":
    "/assets/products/06-CBD-gummies-300x300.jpeg",
  "2022/12/Healing-balm-300x300.jpeg":
    "/assets/products/07-Healing-balm-300x300.jpeg",
  "2022/06/CBD-Oil-300_600-300x300.jpeg":
    "/assets/products/08-CBD-Oil-300_600-300x300.jpeg",
  "2022/12/CBD-Tissue-Oil-200ml-300x300.jpeg":
    "/assets/products/09-CBD-Tissue-Oil-200ml-300x300.jpeg",
  "2022/12/CBD-300mg-vape-juice-300x300.jpeg":
    "/assets/products/10-CBD-300mg-vape-juice-300x300.jpeg",
  "2022/12/CBD-CBG-flower-300x300.jpeg":
    "/assets/products/11-CBD-CBG-flower-300x300.jpeg",
  "2022/12/Choc-chip-Cookies-300x300.jpeg":
    "/assets/products/12-Choc-chip-Cookies-300x300.jpeg",
  "2022/12/Clit-‘o-Max-Intimate-Bunny-pleasure-oil-300x300.png":
    "/assets/products/13-Clit-intimate-bunny-pleasure-oil-300x300.png",
  "2022/12/Ginger-Cookies-300x300.jpeg":
    "/assets/products/14-Ginger-Cookies-300x300.jpeg",
  "2022/12/Meme-pain-gel.jpeg": "/assets/products/15-Meme-pain-gel.jpeg",
  "2023/04/Mountain-Zero-Hemp-Smokes-300x300.jpeg":
    "/assets/products/16-Mountain-Zero-Hemp-Smokes-300x300.jpeg",
  "2022/12/PALVBLU-CBD-Rooibos-tea-300x300.jpeg":
    "/assets/products/17-PALVBLU-CBD-Rooibos-tea-300x300.jpeg",
  "2022/12/CBD-male-or-female-libido-enhancers-300x300.jpeg":
    "/assets/products/18-CBD-male-or-female-libido-enhancers-300x300.jpeg",
  "2022/12/water-soluble-300x300.jpeg":
    "/assets/products/19-water-soluble-300x300.jpeg",
};

const img = (path: string) => {
  const assetPath = assetByPath[path] ?? path;
  return `${import.meta.env.BASE_URL}${assetPath.replace(/^\//, "")}`;
};

export const products: Product[] = [
  {
    slug: "adler-zero-hemp-smokes",
    name: "Adler Zero Hemp Smokes",
    price: 240,
    category: "Smokeables",
    image: img("2023/04/Adler-Zero-Hemp-Smokes-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "bran-rusks",
    name: "Bran Rusks 100mg total (10 rusks per packet)",
    price: 150,
    category: "Edibles",
    image: img("2022/12/Bran-Rusks-300x300.jpeg"),
    accent: "#efe6d8",
  },
  {
    slug: "buttermilk-rusks",
    name: "Buttermilk Rusks 100mg total (10 rusks per packet)",
    price: 150,
    category: "Edibles",
    image: img("2022/12/Buttermilk-Rusks-300x300.jpeg"),
    accent: "#efe6d8",
  },
  {
    slug: "cbd-flower-pre-rolls",
    name: "CBD Flower (Less than 0.001% THC) Pre Rolls",
    price: 160,
    category: "Smokeables",
    image: img("2022/12/CBD-flower-Pre-Rolls-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "cbd-flower",
    name: "CBD Flower per gram (Less than 0.001% THC)",
    price: 130,
    category: "Smokeables",
    image: img("2022/12/CBD-flower-1-300x300.png"),
    accent: "#dde8dc",
  },
  {
    slug: "cbd-gummies",
    name: "CBD Gummies",
    price: 229,
    category: "Edibles",
    image: img("2023/04/CBD-gummies-300x300.jpeg"),
    accent: "#efe6d8",
  },
  {
    slug: "cbd-healing-balm-250mg-50g",
    name: "CBD Healing Balm (250mg) 50g",
    price: 160,
    category: "Cosmetics",
    image: img("2022/12/Healing-balm-300x300.jpeg"),
    accent: "#f4f5f2",
  },
  {
    slug: "cbd-oil-300mg",
    name: "CBD Oil 300mg",
    price: 400,
    category: "Wellness",
    image: img("2022/06/CBD-Oil-300_600-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "cbd-tissue-oil-200ml",
    name: "CBD Tissue Oil 200ml",
    price: 400,
    category: "Cosmetics",
    image: img("2022/12/CBD-Tissue-Oil-200ml-300x300.jpeg"),
    accent: "#f4f5f2",
  },
  {
    slug: "cbd-vape-juice",
    name: "CBD Vape Juice (300mg)",
    price: 350,
    category: "Smokeables",
    image: img("2022/12/CBD-300mg-vape-juice-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "cbd-cbg-oil-600mg",
    name: "CBD/ CBG Oil 600mg",
    price: 750,
    category: "Wellness",
    image: img("2022/06/CBD-Oil-300_600-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "cbd-cbg-flower",
    name: "CBD/CBG Flower per gram (Less than 0.001% THC)",
    price: 140,
    category: "Smokeables",
    image: img("2022/12/CBD-CBG-flower-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "choc-chip-cookies",
    name: "Choc-Chip Cookies (10mg per cookie, 150mg total per pack)",
    price: 150,
    category: "Edibles",
    image: img("2022/12/Choc-chip-Cookies-300x300.jpeg"),
    accent: "#efe6d8",
  },
  {
    slug: "max-intimate-bunny-pleasure-oil",
    name: "Clit‘ o’ Max Intimate Bunny pleasure oil",
    price: 300,
    category: "Wellness",
    image: img("2022/12/Clit-‘o-Max-Intimate-Bunny-pleasure-oil-300x300.png"),
    accent: "#f4f5f2",
  },
  {
    slug: "ginger-cookies",
    name: "Ginger Cookies (10mg per cookie, 150mg total per pack)",
    price: 150,
    category: "Edibles",
    image: img("2022/12/Ginger-Cookies-300x300.jpeg"),
    accent: "#efe6d8",
  },
  {
    slug: "meme-pain-gel",
    name: "Meme pain gel",
    price: 400,
    category: "Wellness",
    image: img("2022/12/Meme-pain-gel.jpeg"),
    accent: "#f4f5f2",
  },
  {
    slug: "mountain-zero-hemp-smokes",
    name: "Mountain Zero Hemp Smokes",
    price: 240,
    category: "Smokeables",
    image: img("2023/04/Mountain-Zero-Hemp-Smokes-300x300.jpeg"),
    accent: "#dde8dc",
  },
  {
    slug: "palvblu-cbd-rooibos-tea",
    name: "PALVBLU CBD Rooibos Tea (10 teabags)",
    price: 130,
    category: "Wellness",
    image: img("2022/12/PALVBLU-CBD-Rooibos-tea-300x300.jpeg"),
    accent: "#efe6d8",
  },
  {
    slug: "spark-cbd-female-libido-enhancers",
    name: "Spark CBD female libido enhancers",
    price: 300,
    category: "Wellness",
    image: img("2022/12/CBD-male-or-female-libido-enhancers-300x300.jpeg"),
    accent: "#f4f5f2",
  },
  {
    slug: "spark-cbd-male-libido-enhancers",
    name: "Spark CBD male libido enhancers",
    price: 300,
    category: "Wellness",
    image: img("2022/12/CBD-male-or-female-libido-enhancers-300x300.jpeg"),
    accent: "#f4f5f2",
  },
  {
    slug: "water-soluble-box",
    name: "Water Soluble Box",
    price: 450,
    category: "Edibles",
    image: img("2022/12/water-soluble-300x300.jpeg"),
    accent: "#dde8dc",
  },
];

export const categories: { name: Category; eyebrow: string; copy: string }[] = [
  {
    name: "Wellness",
    eyebrow: "Slow down",
    copy: "A considered collection for your everyday ritual.",
  },
  {
    name: "Cosmetics",
    eyebrow: "Care deeply",
    copy: "Botanical care with a quieter point of view.",
  },
  {
    name: "Smokeables",
    eyebrow: "Stay curious",
    copy: "High-CBD, low-THC options for adult customers.",
  },
  {
    name: "Edibles",
    eyebrow: "Take a moment",
    copy: "Small, warm indulgences from the Club kitchen.",
  },
];

export const money = (value: number) =>
  `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
