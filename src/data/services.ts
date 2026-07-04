export type Complexity = "easy" | "medium" | "complex";

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  details: string;
  features: string[];
  icon: string;
  image: string;
}

export const services: Service[] = [
  {
    id: "clipping-path",
    title: "Clipping Path",
    tagline: "Hand drawn clipping paths for clear photos",
    description: "Place your product on any background. Outsource photo edits with our clipping path service.",
    details: "We utilize the precision of the pen tool to create flawless clipping paths that isolate your images with unmatched accuracy. Our expert designers meticulously outline each object, ensuring a clean and professional finish that enhances your visuals.",
    features: ["Hand-drawn precision paths", "Single & multi-path options", "Clean edge isolation", "Background replacement ready"],
    icon: "✂️",
    image: "/images/clipping-path-1.jpg",
  },
  {
    id: "background-removal",
    title: "Background Removal",
    tagline: "Make your products pop with clean images",
    description: "We remove distractions so your products are in focus. Outsource this and save time and get consistent results every time.",
    details: "Our background removal service uses a combination of advanced techniques including layer masks for non-destructive edits, ensuring perfect results that highlight your images.",
    features: ["White background ready", "Complex edge handling", "Bulk processing available", "Platform optimized"],
    icon: "🖼️",
    image: "/images/background-removal.jpg",
  },
  {
    id: "image-masking",
    title: "Image Masking",
    tagline: "Accurate masking on the images",
    description: "Remove complex backgrounds like fur and hair with ease. Our professionals create pixel perfect masks for your images.",
    details: "Our skilled professionals specialize in isolating intricate elements like flowing hair, delicate fur, or transparent objects while maintaining the natural beauty of your subjects.",
    features: ["Hair & fur masking", "Transparent object handling", "Soft edge precision", "Seamless integration"],
    icon: "🎭",
    image: "/images/image-masking-1.jpg",
  },
  {
    id: "shadow-creation",
    title: "Shadow Creation",
    tagline: "Add realism to your product images",
    description: "Make your product photos look more real with our shadow services. We create realistic shadows to make your products look more beautiful and alluring.",
    details: "We use drop shadows, natural shadows, and reflection shadows to create natural-looking results so your visuals pop and grab attention.",
    features: ["Natural shadows", "Drop shadows", "Reflection shadows", "Floating shadows"],
    icon: "🌓",
    image: "/images/shadow-creation.gif",
  },
  {
    id: "ghost-mannequin",
    title: "Ghost Mannequin",
    tagline: "Enhance your clothing",
    description: "Make a statement with your clothes. Our staff creates realistic, high quality ghost mannequin images for the products you provide.",
    details: "This innovative technique removes mannequins from your apparel photos, leaving behind a realistic 3D effect that highlights every detail of your garments.",
    features: ["3D realistic effect", "Neck & sleeve precision", "Bulk apparel editing", "E-commerce optimized"],
    icon: "👕",
    image: "/images/ghost-mannequin.jpeg",
  },
  {
    id: "color-change",
    title: "Color Change",
    tagline: "Rethink your products",
    description: "Show your products in multiple colors without extra photo shoots. Save time and money.",
    details: "Our expert team ensures flawless and natural-looking color edits. From subtle enhancements to complete color overhauls, we preserve texture, shadows, and lighting.",
    features: ["Multiple color variants", "Brand color matching", "Natural preservation", "Bulk color editing"],
    icon: "🎨",
    image: "/images/color-change.jpg",
  },
  {
    id: "photo-retouching",
    title: "Photo Retouching",
    tagline: "Items sell because they look good in pictures",
    description: "Fix blemishes and scratches, remove creases and flaws and improve textures in your images.",
    details: "Using Adobe Photoshop and Lightroom tools we refine skin tones, remove blemishes and adjust lighting. We offer beauty airbrushing, dust removal, wrinkle correction, and more.",
    features: ["Beauty airbrushing", "Dust & scratch removal", "Wrinkle correction", "Skin tone refinement"],
    icon: "✨",
    image: "/images/photo-retouching-1.jpg",
  },
  {
    id: "multi-clipping-path",
    title: "Multi Clipping Path",
    tagline: "Complex cutouts made simple",
    description: "Need help with tricky cutouts? Our skilled editors can handle the most complex images with fine details.",
    details: "This advanced technique isolates multiple parts of a single image for targeted adjustments, such as color correction, layer editing, or adding effects.",
    features: ["Per-part color adjustment", "Complex product handling", "Layer separation", "Precision editing"],
    icon: "🔀",
    image: "/images/multi-clipping-path-1.jpg",
  },
  {
    id: "ecommerce-editing",
    title: "E-commerce Image Editing",
    tagline: "Professional E-commerce Image Editing",
    description: "Get professional editing services for your product images optimized for online sales.",
    details: "From cleaning up backgrounds to refining every detail, we deliver polished, professional images optimized for Amazon, Shopify, eBay, and Etsy.",
    features: ["Platform optimization", "Background cleanup", "Color consistency", "Bulk catalog editing"],
    icon: "🛒",
    image: "/images/ecommerce-image-editing.jpg",
  },
  {
    id: "car-editing",
    title: "Car Image Editing",
    tagline: "Car image perfection",
    description: "Boost your car listings with our photo editing services. Background removal, color correction and retouching.",
    details: "We bring out the best in your automotive visuals. From background replacement to color correction and shadow adjustments, we ensure your car images are polished to perfection.",
    features: ["Background replacement", "Color enhancement", "Reflection & shadow", "Scratch removal"],
    icon: "🚗",
    image: "/images/car-editing-1.jpg",
  },
];
