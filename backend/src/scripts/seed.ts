import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Product } from "../models/Product";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/stationery_showcase";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding");

  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase().trim() });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      name: "Admin",
      roles: ["admin"],
      isActive: true,
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin user already exists");
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      {
        title: "Classic Blue Ballpoint Pen",
        slug: "classic-blue-ballpoint-pen",
        description: "Smooth-writing ballpoint pen perfect for everyday use.",
        price: 25,
        currency: "INR",
        category: "Pens",
        tags: ["ballpoint", "blue", "office"],
        images: ["/images/products/pens-collection.jpg"],
        stock: 200,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "A5 Ruled Notebook",
        slug: "a5-ruled-notebook",
        description: "Hardcover A5 notebook with 200 ruled pages.",
        price: 150,
        currency: "INR",
        category: "Notebooks",
        tags: ["notebook", "ruled", "school"],
        images: ["/images/products/notebooks-stack.jpg"],
        stock: 120,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Fine Tip Black Gel Pen",
        slug: "fine-tip-black-gel-pen",
        description: "0.5mm fine tip gel pen with dark, quick-drying ink.",
        price: 35,
        currency: "INR",
        category: "Pens",
        tags: ["gel pen", "black", "fine tip"],
        images: ["/images/products/pens-collection.jpg"],
        stock: 180,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Premium Rollerball Pen Set",
        slug: "premium-rollerball-pen-set",
        description: "Set of 5 smooth rollerball pens in assorted colours.",
        price: 220,
        currency: "INR",
        category: "Pens",
        tags: ["rollerball", "assorted", "office"],
        images: ["/images/products/pens-collection.jpg"],
        stock: 90,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "A5 Dotted Bullet Journal",
        slug: "a5-dotted-bullet-journal",
        description: "Cream paper dotted notebook ideal for bullet journaling.",
        price: 199,
        currency: "INR",
        category: "Notebooks",
        tags: ["bullet journal", "dotted", "planning"],
        images: ["/images/products/notebooks-stack.jpg"],
        stock: 75,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Hardcover Sketchbook A4",
        slug: "hardcover-sketchbook-a4",
        description: "Thick, acid-free pages for sketching and illustration.",
        price: 260,
        currency: "INR",
        category: "Sketchbooks",
        tags: ["sketchbook", "art", "drawing"],
        images: ["/images/products/art-supplies.jpg"],
        stock: 60,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Sticky Notes Pastel Pack",
        slug: "sticky-notes-pastel-pack",
        description: "Pack of 5 pastel coloured sticky notes for quick reminders.",
        price: 80,
        currency: "INR",
        category: "Desk Essentials",
        tags: ["sticky notes", "pastel", "office"],
        images: ["/images/products/desk-essentials.jpg"],
        stock: 300,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Metal Binder Clips Set",
        slug: "metal-binder-clips-set",
        description: "Set of 30 medium metal binder clips in a storage box.",
        price: 120,
        currency: "INR",
        category: "Desk Essentials",
        tags: ["binder clips", "organization"],
        images: ["/images/products/desk-essentials.jpg"],
        stock: 150,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Dual Highlighter Pack",
        slug: "dual-highlighter-pack",
        description: "Set of 6 dual-tip highlighters in soft pastel colours.",
        price: 160,
        currency: "INR",
        category: "Markers & Highlighters",
        tags: ["highlighter", "pastel", "dual-tip"],
        images: ["/images/products/art-supplies.jpg"],
        stock: 110,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Mechanical Pencil 0.7mm",
        slug: "mechanical-pencil-0-7mm",
        description: "Ergonomic mechanical pencil with 0.7mm lead and grip.",
        price: 90,
        currency: "INR",
        category: "Pencils",
        tags: ["mechanical pencil", "0.7mm"],
        images: ["/images/products/pens-collection.jpg"],
        stock: 140,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Graph Paper Notebook A4",
        slug: "graph-paper-notebook-a4",
        description: "A4 size notebook with graph pages for diagrams and maths.",
        price: 130,
        currency: "INR",
        category: "Notebooks",
        tags: ["graph paper", "maths"],
        images: ["/images/products/notebooks-stack.jpg"],
        stock: 85,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Desk Organizer Tray",
        slug: "desk-organizer-tray",
        description: "Minimal desk organizer tray to hold pens and small items.",
        price: 275,
        currency: "INR",
        category: "Desk Essentials",
        tags: ["organizer", "desk"],
        images: ["/images/products/desk-essentials.jpg"],
        stock: 45,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Coloured Pencils 24 Set",
        slug: "coloured-pencils-24-set",
        description: "Set of 24 smooth coloured pencils for art and colouring.",
        price: 210,
        currency: "INR",
        category: "Art Supplies",
        tags: ["coloured pencils", "art"],
        images: ["/images/products/art-supplies.jpg"],
        stock: 95,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Mini Desk Calendar",
        slug: "mini-desk-calendar",
        description: "Compact standing desk calendar with monthly views.",
        price: 150,
        currency: "INR",
        category: "Desk Essentials",
        tags: ["calendar", "planning"],
        images: ["/images/products/office-set.jpg"],
        stock: 70,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Wirebound Project Book",
        slug: "wirebound-project-book",
        description: "Sectioned wirebound notebook ideal for project notes.",
        price: 185,
        currency: "INR",
        category: "Notebooks",
        tags: ["project book", "wirebound"],
        images: ["/images/products/notebooks-stack.jpg"],
        stock: 65,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Index Tabs Assorted Colours",
        slug: "index-tabs-assorted-colours",
        description: "Pack of repositionable index tabs in assorted colours.",
        price: 60,
        currency: "INR",
        category: "Desk Essentials",
        tags: ["index tabs", "organisation"],
        images: ["/images/products/desk-essentials.jpg"],
        stock: 220,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Calligraphy Brush Pen Set",
        slug: "calligraphy-brush-pen-set",
        description: "Set of 6 brush pens for modern calligraphy practice.",
        price: 320,
        currency: "INR",
        category: "Art Supplies",
        tags: ["calligraphy", "brush pen"],
        images: ["/images/products/art-supplies.jpg"],
        stock: 55,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Desk Letter Tray",
        slug: "desk-letter-tray",
        description: "Stackable letter tray to keep documents organised.",
        price: 240,
        currency: "INR",
        category: "Desk Essentials",
        tags: ["letter tray", "office"],
        images: ["/images/products/office-set.jpg"],
        stock: 40,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: "Pocket Notebook 3 Pack",
        slug: "pocket-notebook-3-pack",
        description: "Set of three pocket-sized notebooks for notes on the go.",
        price: 110,
        currency: "INR",
        category: "Notebooks",
        tags: ["pocket notebook", "set"],
        images: ["/images/products/notebooks-stack.jpg"],
        stock: 130,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: "Ruler and Geometry Set",
        slug: "ruler-and-geometry-set",
        description: "Essential geometry set with ruler, set squares and protractor.",
        price: 95,
        currency: "INR",
        category: "School Supplies",
        tags: ["geometry set", "ruler"],
        images: ["/images/products/office-set.jpg"],
        stock: 160,
        isFeatured: false,
        isPublished: true,
      },
    ]);
    console.log("Inserted sample products");
  } else {
    console.log("Products already exist, skipping sample insertion");
  }

  await mongoose.disconnect();
  console.log("Seeding complete");
}

run().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});

