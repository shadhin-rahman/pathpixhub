export interface WhyChooseItem {
  title: string;
  desc: string;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  details: string;
  headline: string;
  paragraphs: string[];
  whyChoose: WhyChooseItem[];
  features: string[];
  icon: string;
  image: string;
}

export const priceMap: Record<string, string> = {
  "clipping-path": "FROM $0.39 / IMAGE",
  "background-removal": "FROM $0.39 / IMAGE",
  "shadow-creation": "FROM $0.25 / IMAGE",
  "ghost-mannequin": "FROM $0.89 / IMAGE",
  "image-masking": "FROM $1.19 / IMAGE",
  "color-change": "FROM $0.99 / IMAGE",
  "photo-retouching": "FROM $0.69 / IMAGE",
  "multi-clipping-path": "FROM $1.19 / IMAGE",
  "ecommerce-editing": "FROM $2.99 / IMAGE",
  "car-editing": "FROM $2.99 / IMAGE",
};

export const services: Service[] = [
  {
    id: "clipping-path",
    title: "Clipping Path",
    tagline: "Hand drawn clipping paths for clear photos",
    description: "Place your product on any background. Outsource photo edits with our clipping path service.",
    details: "We utilize the precision of the pen tool to create flawless clipping paths that isolate your images with unmatched accuracy. Our expert designers meticulously outline each object, ensuring a clean and professional finish that enhances your visuals.",
    headline: "Achieve Flawless Image Cutouts with Professional Clipping Path Services",
    paragraphs: [
      "At PathPixHub, we specialize in delivering precise clipping path solutions tailored to meet your specific needs. Whether you're in e-commerce, advertising, or photography, our clipping path services ensure clean and accurate cutouts that make your images stand out. Using advanced photo-editing tools, we manually draw paths around your subjects to separate them from backgrounds with unparalleled precision.",
      "Our team understands the importance of fine details. From simple shapes to complex outlines, we handle everything from single paths to multi-layered clipping paths for advanced editing needs. This service is perfect for isolating products, replacing backgrounds, or creating high-quality, professional visuals that capture attention.",
    ],
    whyChoose: [
      { title: "Precision", desc: "Every path is hand-drawn for maximum accuracy." },
      { title: "Custom Solutions", desc: "Tailored to meet your project requirements, whether it's single or multi-clipping path editing." },
      { title: "Fast Turnaround", desc: "Get your images processed quickly without compromising on quality." },
      { title: "Versatility", desc: "Ideal for e-commerce photos, catalogs, advertisements, and more." },
    ],
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
    headline: "Transform Your Images with Expert Background Removal Services",
    paragraphs: [
      "We provide professional background removal services to make your images shine. Whether you're selling products online, creating marketing materials, or refining personal photos, removing distracting backgrounds can elevate the quality of your visuals. Our skilled editors use advanced tools to carefully isolate your subjects, ensuring clean, polished results that grab attention.",
      "Background removal is ideal for e-commerce businesses, photographers, and designers who need high-quality images without the hassle. From simple backgrounds to intricate details like hair and transparent objects, we handle every project with precision. With our services, your images will look professional, clear, and ready to impress.",
    ],
    whyChoose: [
      { title: "Enhanced Product Presentation", desc: "Showcase your products on plain, white, or custom backgrounds for e-commerce platforms like Amazon or Shopify." },
      { title: "Accuracy and Detail", desc: "We specialize in complex background removal, ensuring smooth edges and natural results." },
      { title: "Time-Saving", desc: "Outsource the tedious work to us and focus on your core business activities." },
      { title: "Custom Solutions", desc: "Whether you need single images or bulk editing, we cater to projects of all sizes." },
    ],
    features: ["White background ready", "Complex edge handling", "Bulk processing available", "Platform optimized"],
    icon: "🖼️",
    image: "/images/Background Removal.jpg",
  },
  {
    id: "image-masking",
    title: "Image Masking",
    tagline: "Accurate masking on the images",
    description: "Remove complex backgrounds like fur and hair with ease. Our professionals create pixel perfect masks for your images.",
    details: "Our skilled professionals specialize in isolating intricate elements like flowing hair, delicate fur, or transparent objects while maintaining the natural beauty of your subjects.",
    headline: "Bring Your Images to Life with Flawless Masking",
    paragraphs: [
      "Some images demand more than just standard editing—especially when dealing with fine details like flowing hair, delicate fur, or transparent objects. That's where PathPixHub's Image Masking Services come in. Our skilled professionals specialize in isolating intricate elements while maintaining the natural beauty of your subjects.",
      "From fashion photography to product shots, we ensure that your images are ready for seamless integration into any background or design. Whether it's for e-commerce, print, or advertising, we guarantee precision and consistency in every edit.",
    ],
    whyChoose: [
      { title: "Effortless Edge Control", desc: "Handle complex details with precision, keeping hair strands, soft textures, and semi-transparent objects intact." },
      { title: "Enhanced Flexibility", desc: "Replace or enhance backgrounds without compromising on image quality." },
      { title: "Tailored Editing", desc: "We adapt to your specific requirements, offering solutions for both individual and bulk projects." },
      { title: "Save Time and Hassle", desc: "Focus on your creative projects while we manage the intricate editing for you." },
    ],
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
    headline: "Add Depth and Realism to Your Images with Professional Shadow Services",
    paragraphs: [
      "At PathPixHub, we specialize in creating shadows that make your images look natural, dynamic, and professional. Whether it's drop shadows, natural shadows, or reflection shadows, our team ensures that your photos gain depth and dimension, creating a striking visual appeal.",
      "Shadows are more than just aesthetics—they add a realistic touch, making your products or subjects feel grounded. Our services are ideal for e-commerce businesses, photographers, and marketers who want their images to leave a lasting impression.",
    ],
    whyChoose: [
      { title: "Tailored Solutions", desc: "Whether you need soft natural shadows or bold drop shadows, we customize the effect to suit your needs." },
      { title: "High Precision", desc: "We pay attention to lighting, angles, and proportions to ensure that shadows blend seamlessly with your image." },
      { title: "Boost Product Appeal", desc: "Shadows add depth, making your products appear more professional and visually engaging." },
      { title: "Quick Turnaround", desc: "Get expertly edited images delivered on time, even for bulk projects." },
    ],
    features: ["Natural shadow", "Drop shadow", "Reflection shadow", "Existing shadow", "Floating shadow"],
    icon: "🌓",
    image: "/images/Shadow Creation.gif",
  },
  {
    id: "ghost-mannequin",
    title: "Ghost Mannequin",
    tagline: "Enhance your clothing",
    description: "Make a statement with your clothes. Our staff creates realistic, high quality ghost mannequin images for the products you provide.",
    details: "This innovative technique removes mannequins from your apparel photos, leaving behind a realistic 3D effect that highlights every detail of your garments.",
    headline: "Bring Your Apparel to Life with Invisible Mannequin Effects",
    paragraphs: [
      "Give your clothing the spotlight it deserves with PathPixHub's Ghost Mannequin Services. This innovative technique removes mannequins from your apparel photos, leaving behind a realistic 3D effect that highlights every detail of your garments.",
      "Our expert team works meticulously to ensure each image reflects the natural structure of the clothing, from neckline to hem. By seamlessly blending and retouching fabric edges, we make sure your garments look polished and professional.",
    ],
    whyChoose: [
      { title: "Realistic 3D Effects", desc: "Showcase your apparel as if it's floating, creating a premium, sophisticated presentation." },
      { title: "Attention to Detail", desc: "We handle intricate areas like collars, sleeves, and inner linings with precision." },
      { title: "Brand-Ready Images", desc: "Tailored for online stores, product catalogs, and marketing campaigns." },
      { title: "Scalable for Bulk Projects", desc: "Quick turnaround times, even for large volumes." },
    ],
    features: ["3D realistic effect", "Neck & sleeve precision", "Bulk apparel editing", "E-commerce optimized"],
    icon: "👕",
    image: "/images/Ghost Mannequin.jpeg",
  },
  {
    id: "color-change",
    title: "Color Change",
    tagline: "Rethink your products",
    description: "Show your products in multiple colors without extra photo shoots. Save time and money.",
    details: "Our expert team ensures flawless and natural-looking color edits. From subtle enhancements to complete color overhauls, we preserve texture, shadows, and lighting.",
    headline: "Revamp Your Images with Stunning Color Transformations",
    paragraphs: [
      "Bring new life to your images with PathPixHub's Color Change Services. Whether you're showcasing product variations, updating your brand's visuals, or creating striking color effects, our expert team ensures flawless and natural-looking edits.",
      "Our services are perfect for e-commerce businesses, photographers, and marketers who need consistent, high-quality visuals without the hassle of reshooting. By seamlessly altering hues, tones, or shades, we help you create a cohesive, professional image library.",
    ],
    whyChoose: [
      { title: "Showcase Variety", desc: "Easily present multiple product colors from a single image." },
      { title: "Natural Results", desc: "We preserve the texture, shadows, and lighting in every edit to keep the image realistic." },
      { title: "Tailored Edits", desc: "Custom solutions for both single images and bulk projects, designed to fit your needs." },
      { title: "Quick and Efficient", desc: "Save time and resources with fast, reliable service." },
    ],
    features: ["Multiple color variants", "Brand color matching", "Natural preservation", "Bulk color editing"],
    icon: "🎨",
    image: "/images/Color Change.jpg",
  },
  {
    id: "photo-retouching",
    title: "Photo Retouching",
    tagline: "Items sell because they look good in pictures",
    description: "Fix blemishes and scratches, remove creases and flaws and improve textures in your images.",
    details: "Using Adobe Photoshop and Lightroom tools we refine skin tones, remove blemishes and adjust lighting. We offer beauty airbrushing, dust removal, wrinkle correction, and more.",
    headline: "Turn Good Photos Into Stunning Masterpieces",
    paragraphs: [
      "At PathPixHub, we believe every photo tells a story—and we're here to make that story unforgettable. Our Photo Retouching Services are crafted to breathe life into your images by refining details, enhancing quality, and ensuring every shot looks picture-perfect.",
      "Whether you're an e-commerce business looking for polished product photos, a photographer perfecting wedding or portrait shots, or a marketer creating visuals for a campaign, our retouching services cater to all your needs. We eliminate imperfections while preserving the natural beauty of your images.",
    ],
    whyChoose: [
      { title: "Attention to Detail", desc: "Every pixel is carefully retouched to perfection." },
      { title: "Versatility", desc: "From portraits to commercial photos, we handle diverse projects with expertise." },
      { title: "Quick Turnaround", desc: "Get your professionally retouched images on time, every time." },
    ],
    features: ["Beauty airbrushing", "Camera reflection removal", "Dust, spot and scratch removal", "Wrinkle on clothing category", "Symmetrical edit", "Color variants", "Additional copy"],
    icon: "✨",
    image: "/images/photo-retouching-1.jpg",
  },
  {
    id: "multi-clipping-path",
    title: "Multi Clipping Path",
    tagline: "Complex cutouts made simple",
    description: "Need help with tricky cutouts? Our skilled editors can handle the most complex images with fine details.",
    details: "This advanced technique isolates multiple parts of a single image for targeted adjustments, such as color correction, layer editing, or adding effects.",
    headline: "Unlock Advanced Editing with Professional Multiple Clipping Path Services",
    paragraphs: [
      "At PathPixHub, our Multiple Clipping Path Services offer precise control over complex image editing. This advanced technique allows us to isolate multiple parts of a single image for targeted adjustments, such as color correction, layer editing, or adding effects.",
      "This service is perfect for e-commerce businesses, photographers, and designers who handle multi-component products like jewelry, apparel, furniture, or mechanical parts. By applying separate paths to different elements, we ensure each section can be edited individually without affecting the rest of the image.",
    ],
    whyChoose: [
      { title: "Advanced Customization", desc: "Adjust colors, brightness, or textures for specific parts of your image with ease." },
      { title: "Perfect for Complex Products", desc: "Ideal for products with multiple components, such as bags with zippers or watches with intricate details." },
      { title: "Consistent Quality", desc: "We focus on precision, ensuring seamless edits and professional results every time." },
      { title: "Save Time and Effort", desc: "Simplify post-production workflows by outsourcing tedious and technical edits." },
    ],
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
    headline: "Boost Sales with Stunning Product Photos",
    paragraphs: [
      "At PathPixHub, we understand that great product photos drive sales. Our E-commerce Image Editing Services are designed to help your products shine, attracting customers and building trust in your online store. From cleaning up backgrounds to refining every detail, we deliver polished, professional images.",
      "Your e-commerce success depends on visuals that grab attention and meet platform standards. We ensure every image is optimized for platforms like Amazon, Shopify, eBay, and Etsy, helping you stand out from the competition.",
    ],
    whyChoose: [
      { title: "Sales-Driven Images", desc: "We create visuals that not only look great but also boost buyer confidence and conversions." },
      { title: "Custom Solutions", desc: "Tailored editing for individual products or bulk catalogs." },
      { title: "Quick Turnaround", desc: "Get your images ready to upload in record time." },
    ],
    features: ["Platform optimization", "Background cleanup", "Color consistency", "Bulk catalog editing"],
    icon: "🛒",
    image: "/images/E-commerce Image Editing.jpg",
  },
  {
    id: "car-editing",
    title: "Car Image Editing",
    tagline: "Car image perfection",
    description: "Boost your car listings with our photo editing services. Background removal, color correction and retouching.",
    details: "We bring out the best in your automotive visuals. From background replacement to color correction and shadow adjustments, we ensure your car images are polished to perfection.",
    headline: "Drive Attention with Stunning Car Image Editing Services",
    paragraphs: [
      "At PathPixHub, we bring out the best in your automotive visuals with our professional Car Image Editing Services. Whether you're a car dealership, an online seller, or a photographer, our expert editors refine every detail of your car photos to make them look flawless and captivating.",
      "We specialize in enhancing car images to highlight their design, color, and features while eliminating distractions. From background replacement to color correction and shadow adjustments, we ensure your car images are polished to perfection, ready to impress buyers.",
    ],
    whyChoose: [
      { title: "Attention to Detail", desc: "We focus on every aspect of your car photo to ensure perfection." },
      { title: "Custom Edits", desc: "Tailored solutions for dealerships, photographers, and automotive platforms." },
      { title: "Consistency Across Images", desc: "Perfect for creating uniform and professional image galleries." },
      { title: "Fast Turnaround", desc: "Get your images edited quickly without compromising on quality." },
    ],
    features: ["Background replacement", "Color enhancement", "Reflection & shadow", "Scratch removal"],
    icon: "🚗",
    image: "/images/car-editing-1.jpg",
  },
];
