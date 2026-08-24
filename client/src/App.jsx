import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // THEME
  // ==============================

  const [theme, setTheme] = useState({
    primary: "#111111",
    background: "#ffffff",
    accent: "#f4f4f4",
    text: "#111111",
  });

  // ==============================
  // UNDO / REDO
  // ==============================

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  // ==============================
  // PREVIEW MODE
  // ==============================

  const [previewMode, setPreviewMode] =
    useState("desktop");

  // ==============================
  // IMAGES
  // ==============================

  const [logoImage, setLogoImage] =
    useState("");

  const [heroImage, setHeroImage] =
    useState("");

  // ==============================
  // PRODUCTS
  // ==============================

  const [products, setProducts] = useState([
    {
      name: "Premium Wallet",
      price: "₹1,499",
      image: "",
    },
    {
      name: "Classic Shoes",
      price: "₹2,999",
      image: "",
    },
    {
      name: "Leather Belt",
      price: "₹999",
      image: "",
    },
  ]);

  // ==============================
  // GENERATE WEBSITE
  // ==============================

  const generateWebsite = async () => {
    if (!prompt.trim()) {
      setError(
        "Please describe your website."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await axios.post(
          "http://localhost:5000/api/generate",
          {
            prompt,
          }
        );

      setWebsite(response.data);

      setHistory([]);
      setFuture([]);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to generate website."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // WEBSITE UPDATE
  // ==============================

  const updateWebsite = (
    field,
    value
  ) => {
    if (!website) return;

    setHistory((prev) => [
      ...prev,
      JSON.parse(
        JSON.stringify(website)
      ),
    ]);

    setFuture([]);

    setWebsite((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==============================
  // HERO UPDATE
  // ==============================

  const updateHero = (
    field,
    value
  ) => {
    if (!website) return;

    setHistory((prev) => [
      ...prev,
      JSON.parse(
        JSON.stringify(website)
      ),
    ]);

    setFuture([]);

    setWebsite((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  // ==============================
  // ABOUT UPDATE
  // ==============================

  const updateAbout = (
    field,
    value
  ) => {
    if (!website) return;

    setHistory((prev) => [
      ...prev,
      JSON.parse(
        JSON.stringify(website)
      ),
    ]);

    setFuture([]);

    setWebsite((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }));
  };

  // ==============================
  // UNDO
  // ==============================

  const undo = () => {
    if (
      history.length === 0 ||
      !website
    ) {
      return;
    }

    const previous =
      history[history.length - 1];

    setFuture((prev) => [
      JSON.parse(
        JSON.stringify(website)
      ),
      ...prev,
    ]);

    setWebsite(previous);

    setHistory((prev) =>
      prev.slice(0, -1)
    );
  };

  // ==============================
  // REDO
  // ==============================

  const redo = () => {
    if (
      future.length === 0 ||
      !website
    ) {
      return;
    }

    const next = future[0];

    setHistory((prev) => [
      ...prev,
      JSON.parse(
        JSON.stringify(website)
      ),
    ]);

    setWebsite(next);

    setFuture((prev) =>
      prev.slice(1)
    );
  };



  // ==============================
// PHASE 8 - IMAGE TO BASE64
// ==============================

const convertImageToBase64 = (
  file,
  maxWidth = 1600,
  quality = 0.85
) => {
  return new Promise(
    (resolve, reject) => {

      if (!file) {
        reject(
          new Error(
            "No file selected."
          )
        );
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject(
          new Error(
            "Please select a valid image."
          )
        );
        return;
      }

      const maxSize =
        10 * 1024 * 1024;

      if (file.size > maxSize) {
        reject(
          new Error(
            "Image must be less than 10 MB."
          )
        );
        return;
      }

      const reader =
        new FileReader();

      reader.onload = (event) => {

        const img =
          new Image();

        img.onload = () => {

          let width =
            img.width;

          let height =
            img.height;

          // Resize
          if (
            width >
            maxWidth
          ) {

            height =
              Math.round(
                (height *
                  maxWidth) /
                  width
              );

            width =
              maxWidth;
          }

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            width;

          canvas.height =
            height;

          const ctx =
            canvas.getContext(
              "2d"
            );

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          const base64 =
            canvas.toDataURL(
              "image/jpeg",
              quality
            );

          resolve(base64);
        };

        img.onerror = () => {
          reject(
            new Error(
              "Invalid image."
            )
          );
        };

        img.src =
          event.target.result;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Failed to read image."
          )
        );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
};

// ==============================
// LOGO UPLOAD
// ==============================

const handleLogoUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setError("");

    const base64 =
      await convertImageToBase64(file);

    setLogoImage(base64);

  } catch (error) {
    console.error(error);

    setError(
      error.message ||
        "Failed to upload logo."
    );
  }
};


// ==============================
// HERO IMAGE UPLOAD
// ==============================

const handleHeroUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setError("");

    const base64 =
      await convertImageToBase64(file);

    setHeroImage(base64);

  } catch (error) {
    console.error(error);

    setError(
      error.message ||
        "Failed to upload hero image."
    );
  }
};


// ==============================
// PRODUCT IMAGE UPLOAD
// ==============================

const handleProductImageUpload = async (
  index,
  e
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setError("");

    const base64 =
      await convertImageToBase64(file);

    setProducts((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              image: base64,
            }
          : product
      )
    );

  } catch (error) {
    console.error(error);

    setError(
      error.message ||
        "Failed to upload product image."
    );
  }
};

  // ==============================
  // ADD PRODUCT
  // ==============================

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        name: "New Product",
        price: "₹999",
        image: "",
      },
    ]);
  };

  // ==============================
  // UPDATE PRODUCT
  // ==============================

  const updateProduct = (
    index,
    field,
    value
  ) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              [field]: value,
            }
          : product
      )
    );
  };

  // ==============================
  // DELETE PRODUCT
  // ==============================

  const deleteProduct = (
    index
  ) => {
    setProducts((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ==============================
  // REMOVE LOGO
  // ==============================

  const removeLogo = () => {
    setLogoImage("");
  };

  // ==============================
  // REMOVE HERO IMAGE
  // ==============================

  const removeHeroImage = () => {
    setHeroImage("");
  };

  // ==============================
  // REMOVE PRODUCT IMAGE
  // ==============================

  const removeProductImage = (
    index
  ) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              image: "",
            }
          : product
      )
    );
  };


  // ==============================
// EXPORT HTML
// ==============================

const generateExportHTML = () => {
  if (!website) return "";

  const servicesHTML =
    website.services
      ?.map(
        (service, index) => `
          <div class="service-card">
            <span>0${index + 1}</span>
            <h3>${service.title || ""}</h3>
            <p>${service.description || ""}</p>
          </div>
        `
      )
      .join("") || "";

  const productsHTML =
    products
      .map(
        (product) => `
          <div class="product-card">

            <div class="product-image">
              ${
                product.image
                  ? `<img src="${product.image}" alt="${product.name}" />`
                  : `<div class="no-image">Product Image</div>`
              }
            </div>

            <div class="product-info">

              <h3>${product.name}</h3>

              <strong>
                ${product.price}
              </strong>

              <button>
                Add to Cart
              </button>

            </div>

          </div>
        `
      )
      .join("");

  return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>
  ${website.title || "AI Website"}
</title>

<meta
  name="description"
  content="${website.seo?.description || website.tagline || ""}"
/>

<style>

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;

  font-family:
    Inter,
    Arial,
    sans-serif;

  color: ${theme.text};

  background:
    ${theme.background};
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
}

.container {
  width: min(
    1200px,
    calc(100% - 40px)
  );

  margin: auto;
}

/* NAVBAR */

.site-nav {

  position: sticky;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 5%;

  background: ${theme.background};

  border-bottom:
    1px solid #e5e5e5;
}

.site-logo {
  font-size: 20px;
  font-weight: 800;
}

.site-logo img {
  max-width: 150px;
  height: 42px;
  object-fit: contain;
}

.site-links {
  display: flex;
  gap: 28px;
}

.site-links a {
  font-size: 14px;
  font-weight: 600;
}

.nav-button,
.hero-button,
.product-info button {

  padding: 13px 22px;

  border-radius: 6px;

  background:
    ${theme.primary};

  color: white;

  font-weight: 700;
}

/* HERO */

.site-hero {

  min-height: 650px;

  display: flex;
  align-items: center;

  padding: 80px 8%;

  color: white;

  background:
    ${heroImage
      ? `linear-gradient(
          rgba(0,0,0,.55),
          rgba(0,0,0,.55)
        ),
        url("${heroImage}")`
      : theme.primary};

  background-size: cover;

  background-position: center;
}

.hero-content {
  max-width: 720px;
}

.hero-label,
.section-label {

  font-size: 12px;

  letter-spacing: 2px;

  font-weight: 800;

  margin-bottom: 20px;
}

.hero-content h1 {

  font-size:
    clamp(42px, 7vw, 82px);

  line-height: 1;

  margin: 0 0 25px;
}

.hero-content p {

  font-size: 18px;

  line-height: 1.7;

  max-width: 650px;
}

.hero-button {
  margin-top: 20px;

  background: white;

  color: ${theme.primary};
}

/* ABOUT */

.about-section {

  padding: 110px 8%;

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 80px;
}

.about-section h2 {

  font-size: 48px;

  margin: 0;
}

.about-section > p {

  font-size: 18px;

  line-height: 1.8;
}

/* PRODUCTS */

.products-section {

  padding: 110px 8%;

  background:
    ${theme.accent};
}

.section-heading {
  margin-bottom: 45px;
}

.section-heading h2 {

  font-size: 48px;

  margin: 0;
}

.product-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 25px;
}

.product-card {

  overflow: hidden;

  border-radius: 12px;

  background: white;
}

.product-image {

  height: 330px;

  background: #eeeeee;

  display: flex;

  align-items: center;

  justify-content: center;
}

.product-image img {

  width: 100%;

  height: 100%;

  object-fit: cover;
}

.no-image {
  color: #888;
}

.product-info {
  padding: 25px;
}

.product-info h3 {
  margin-top: 0;
}

.product-info strong {

  display: block;

  margin: 15px 0;

  font-size: 20px;
}

/* SERVICES */

.services-section {

  padding: 110px 8%;
}

.service-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 20px;
}

.service-card {

  padding: 35px;

  border:
    1px solid #ddd;

  border-radius: 10px;
}

.service-card span {

  font-size: 12px;

  opacity: .5;
}

.service-card h3 {

  font-size: 25px;

  margin-top: 30px;
}

.service-card p {

  line-height: 1.7;

  color: #666;
}

/* CTA */

.cta-section {

  padding: 120px 8%;

  text-align: center;

  background:
    ${theme.primary};

  color: white;
}

.cta-section h2 {

  max-width: 800px;

  margin: auto;

  font-size:
    clamp(40px, 6vw, 70px);
}

.cta-section p {

  max-width: 650px;

  margin: 25px auto;

  line-height: 1.7;
}

/* FOOTER */

.site-footer {

  padding: 35px 8%;

  display: flex;

  justify-content: space-between;

  background: #111;

  color: white;
}

/* MOBILE */

@media (max-width: 768px) {

  .site-nav {
    flex-wrap: wrap;
    gap: 15px;
  }

  .site-links {
    display: none;
  }

  .site-hero {
    min-height: 600px;
    padding: 60px 25px;
  }

  .about-section {
    grid-template-columns: 1fr;
    padding: 70px 25px;
  }

  .products-section,
  .services-section {
    padding: 70px 25px;
  }

  .product-grid,
  .service-grid {
    grid-template-columns: 1fr;
  }

  .cta-section {
    padding: 80px 25px;
  }

  .site-footer {
    flex-direction: column;
    gap: 15px;
  }

}

</style>

</head>

<body>

<!-- NAVBAR -->

<nav class="site-nav">

  <div class="site-logo">

    ${
      logoImage
        ? `<img src="${logoImage}" alt="${website.title}" />`
        : website.title || ""
    }

  </div>

  <div class="site-links">

    <a href="#home">
      Home
    </a>

    <a href="#about">
      About
    </a>

    <a href="#products">
      Products
    </a>

    <a href="#services">
      Services
    </a>

    <a href="#contact">
      Contact
    </a>

  </div>

  <button class="nav-button">
    ${website.hero?.button || "Get Started"}
  </button>

</nav>

<!-- HERO -->

<section
  id="home"
  class="site-hero"
>

  <div class="hero-content">

    <div class="hero-label">
      PREMIUM EXPERIENCE
    </div>

    <h1>
      ${website.hero?.heading || ""}
    </h1>

    <p>
      ${website.hero?.description || ""}
    </p>

    <button class="hero-button">
      ${website.hero?.button || "Get Started"}
    </button>

  </div>

</section>

<!-- ABOUT -->

<section
  id="about"
  class="about-section"
>

  <div>

    <div class="section-label">
      ABOUT US
    </div>

    <h2>
      ${website.about?.title || ""}
    </h2>

  </div>

  <p>
    ${website.about?.description || ""}
  </p>

</section>

<!-- PRODUCTS -->

<section
  id="products"
  class="products-section"
>

  <div class="section-heading">

    <div class="section-label">
      OUR COLLECTION
    </div>

    <h2>
      Featured Products
    </h2>

  </div>

  <div class="product-grid">

    ${productsHTML}

  </div>

</section>

<!-- SERVICES -->

<section
  id="services"
  class="services-section"
>

  <div class="section-heading">

    <div class="section-label">
      WHAT WE OFFER
    </div>

    <h2>
      Our Services
    </h2>

  </div>

  <div class="service-grid">

    ${servicesHTML}

  </div>

</section>

<!-- CTA -->

<section
  id="contact"
  class="cta-section"
>

  <div class="section-label">
    GET STARTED
  </div>

  <h2>
    ${website.cta?.heading || ""}
  </h2>

  <p>
    ${website.cta?.description || ""}
  </p>

  <button class="hero-button">
    ${website.cta?.button || "Get Started"}
  </button>

</section>

<!-- FOOTER -->

<footer class="site-footer">

  <strong>
    ${website.title || ""}
  </strong>

  <span>
    © 2026 All Rights Reserved
  </span>

</footer>

</body>

</html>
`;
};

// ==============================
// DOWNLOAD HTML
// ==============================

const downloadHTML = () => {

  const html =
    generateExportHTML();

  if (!html) return;

  const blob = new Blob(
    [html],
    {
      type: "text/html",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `${website.title || "website"}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      + ".html";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// ==============================
// COPY HTML
// ==============================

const copyHTML = async () => {

  const html =
    generateExportHTML();

  if (!html) return;

  try {

    await navigator.clipboard.writeText(
      html
    );

    alert(
      "HTML copied successfully!"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Unable to copy HTML."
    );

  }
};
  // ==============================
  // NEW WEBSITE
  // ==============================

  const newWebsite = () => {
    setWebsite(null);

    setPrompt("");

    setError("");

    setHistory([]);

    setFuture([]);

    setLogoImage("");

    setHeroImage("");

    setProducts([
      {
        name: "Premium Wallet",
        price: "₹1,499",
        image: "",
      },
      {
        name: "Classic Shoes",
        price: "₹2,999",
        image: "",
      },
      {
        name: "Leather Belt",
        price: "₹999",
        image: "",
      },
    ]);

    setTheme({
      primary: "#111111",
      background: "#ffffff",
      accent: "#f4f4f4",
      text: "#111111",
    });

    setPreviewMode("desktop");
  };

  return (
    <div className="app">

      {/* ==========================
          HEADER
      ========================== */}

      <header className="builder-header">

        
        <div className="brand">
  <div className="brand-mark">
    <span>✦</span>
  </div>

  <div className="brand-text">
    <strong>MOORTHI</strong>
    <span>AI Website Builder</span>
  </div>
</div>

<div className="status">
  <span className="status-dot"></span>
  AI Ready
</div>

      </header>

      <main className="builder">

        {/* ==========================
            START SCREEN
        ========================== */}

        {!website &&
          !loading && (
            <>
              <section className="builder-intro">

                <p className="eyebrow">
                  AI POWERED WEBSITE GENERATOR
                </p>

                <h1>
                  Build your website
                  <br />

                  <span>
                    with AI.
                  </span>
                </h1>

                <p className="intro-text">
                  Describe your business
                  and let AI create your
                  website instantly.
                </p>

              </section>

              <section className="prompt-card">

                <label>
                  Describe your website
                </label>

                <textarea
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(
                      e.target.value
                    )
                  }
                  placeholder="Create a premium website for..."
                />

                <div className="prompt-footer">

                  <span>
                    ✨ AI will generate
                    your website
                  </span>

                  <button
                    onClick={
                      generateWebsite
                    }
                    disabled={loading}
                  >
                    Generate Website →
                  </button>

                </div>

                {error && (
                  <div className="error">
                    {error}
                  </div>
                )}

              </section>
            </>
          )}

        {/* ==========================
            LOADING
        ========================== */}

        {loading && (
          <div className="loading">

            <div className="loader"></div>

            <h3>
              Creating your website...
            </h3>

            <p>
              AI is generating your
              website.
            </p>

          </div>
        )}

        {/* ==========================
            EDITOR
        ========================== */}

        {website &&
          !loading && (
            <div className="editor">

              {/* =====================
                  SIDEBAR
              ===================== */}

              <aside className="editor-sidebar">

                <h3>
                  Website Editor
                </h3>

                {/* WEBSITE TITLE */}

                <div className="editor-group">

                  <label>
                    Website Title
                  </label>

                  <input
                    value={
                      website.title ||
                      ""
                    }
                    onChange={(e) =>
                      updateWebsite(
                        "title",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* TAGLINE */}

                <div className="editor-group">

                  <label>
                    Tagline
                  </label>

                  <input
                    value={
                      website.tagline ||
                      ""
                    }
                    onChange={(e) =>
                      updateWebsite(
                        "tagline",
                        e.target.value
                      )
                    }
                  />

                </div>

                <hr />

                {/* =====================
                    BRAND / LOGO
                ===================== */}

                <h4>
                  Brand
                </h4>

                <div className="upload-box">

                  <label>
                    Logo
                  </label>

                  {logoImage ? (
                    <div className="upload-preview">

                      <img
                        src={logoImage}
                        alt="Logo"
                      />

                      <button
                        type="button"
                        onClick={
                          removeLogo
                        }
                      >
                        Remove
                      </button>

                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor="logo-upload"
                        className="upload-button"
                      >
                        🖼 Upload Logo
                      </label>

                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={
                          handleLogoUpload
                        }
                        hidden
                      />
                    </>
                  )}

                </div>

                <hr />

                {/* =====================
                    HERO IMAGE
                ===================== */}

                <h4>
                  Hero Image
                </h4>

                <div className="upload-box">

                  {heroImage ? (
                    <div className="upload-preview">

                      <img
                        src={heroImage}
                        alt="Hero"
                      />

                      <button
                        type="button"
                        onClick={
                          removeHeroImage
                        }
                      >
                        Remove
                      </button>

                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor="hero-upload"
                        className="upload-button"
                      >
                        🌄 Upload Hero Image
                      </label>

                      <input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        onChange={
                          handleHeroUpload
                        }
                        hidden
                      />
                    </>
                  )}

                </div>

                <hr />

                {/* =====================
                    HERO EDITOR
                ===================== */}

                <h4>
                  Hero Section
                </h4>

                <div className="editor-group">

                  <label>
                    Hero Heading
                  </label>

                  <textarea
                    value={
                      website.hero
                        ?.heading || ""
                    }
                    onChange={(e) =>
                      updateHero(
                        "heading",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="editor-group">

                  <label>
                    Hero Description
                  </label>

                  <textarea
                    value={
                      website.hero
                        ?.description ||
                      ""
                    }
                    onChange={(e) =>
                      updateHero(
                        "description",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="editor-group">

                  <label>
                    Hero Button
                  </label>

                  <input
                    value={
                      website.hero
                        ?.button || ""
                    }
                    onChange={(e) =>
                      updateHero(
                        "button",
                        e.target.value
                      )
                    }
                  />

                </div>

                <hr />

                {/* =====================
                    ABOUT
                ===================== */}

                <h4>
                  About Section
                </h4>

                <div className="editor-group">

                  <label>
                    About Title
                  </label>

                  <input
                    value={
                      website.about
                        ?.title || ""
                    }
                    onChange={(e) =>
                      updateAbout(
                        "title",
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="editor-group">

                  <label>
                    About Description
                  </label>

                  <textarea
                    value={
                      website.about
                        ?.description ||
                      ""
                    }
                    onChange={(e) =>
                      updateAbout(
                        "description",
                        e.target.value
                      )
                    }
                  />

                </div>

                <hr />

                {/* =====================
                    THEME
                ===================== */}

                <h4>
                  Theme
                </h4>

                <div className="color-control">

                  <label>
                    Primary
                  </label>

                  <input
                    type="color"
                    value={
                      theme.primary
                    }
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        primary:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="color-control">

                  <label>
                    Background
                  </label>

                  <input
                    type="color"
                    value={
                      theme.background
                    }
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        background:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="color-control">

                  <label>
                    Accent
                  </label>

                  <input
                    type="color"
                    value={
                      theme.accent
                    }
                    onChange={(e) =>
                      setTheme({
                        ...theme,
                        accent:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <hr />

                {/* =====================
                    PRODUCTS
                ===================== */}

                <h4>
                  Products
                </h4>

                {products.map(
                  (
                    product,
                    index
                  ) => (
                    <div
                      className="product-editor"
                      key={index}
                    >

                      <label>
                        Product{" "}
                        {index + 1}
                      </label>

                      <input
                        value={
                          product.name
                        }
                        placeholder="Product name"
                        onChange={(e) =>
                          updateProduct(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      <input
                        value={
                          product.price
                        }
                        placeholder="Price"
                        onChange={(e) =>
                          updateProduct(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                      />

                      {/* IMAGE UPLOAD */}

                      {product.image ? (
                        <div className="product-upload-preview">

                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeProductImage(
                                index
                              )
                            }
                          >
                            Remove Image
                          </button>

                        </div>
                      ) : (
                        <>
                          <label
                            htmlFor={`product-image-${index}`}
                            className="upload-button small"
                          >
                            📷 Upload Image
                          </label>

                          <input
                            id={`product-image-${index}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleProductImageUpload(
                                index,
                                e
                              )
                            }
                            hidden
                          />
                        </>
                      )}

                      <button
                        type="button"
                        className="delete-product"
                        onClick={() =>
                          deleteProduct(
                            index
                          )
                        }
                      >
                        Delete Product
                      </button>

                    </div>
                  )
                )}

                <button
                  className="new-project"
                  onClick={addProduct}
                >
                  + Add Product
                </button>

                <hr />

                {/* NEW WEBSITE */}

                <button
                  className="new-project"
                  onClick={
                    newWebsite
                  }
                >
                  + New Website
                </button>

              </aside>

              {/* =====================
                  PREVIEW
              ===================== */}

              <section className="preview-area">

                {/* TOOLBAR */}

                <div className="preview-toolbar">

                  <strong>
                    Live Preview
                  </strong>

                  <div className="preview-controls">



                    <button
                      onClick={undo}
                      disabled={
                        history.length ===
                        0
                      }
                    >
                      ↶ Undo
                    </button>

                    <button
                      onClick={redo}
                      disabled={
                        future.length ===
                        0
                      }
                    >
                      ↷ Redo
                    </button>

                    <button
                      className={
                        previewMode ===
                        "desktop"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setPreviewMode(
                          "desktop"
                        )
                      }
                    >
                      🖥 Desktop
                    </button>

                    <button
                      className={
                        previewMode ===
                        "mobile"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setPreviewMode(
                          "mobile"
                        )
                      }
                    >
                      📱 Mobile
                    </button>


<button
  className="export-button"
  onClick={copyHTML}
>
  📋 Copy HTML
</button>

<button
  className="export-button primary"
  onClick={downloadHTML}
>
  ⬇ Download HTML
</button>

                  </div>

                </div>

                {/* WEBSITE PREVIEW */}

                <div
                  className={`website-preview ${
                    previewMode ===
                    "mobile"
                      ? "mobile-preview"
                      : ""
                  }`}
                  style={{
                    "--primary":
                      theme.primary,

                    "--background":
                      theme.background,

                    "--accent":
                      theme.accent,

                    "--text":
                      theme.text,
                  }}
                >

                  {/* ==================
                      NAVBAR
                  ================== */}

                  <nav className="site-nav">

                    <div className="site-logo">

                      {logoImage ? (
                        <img
                          src={logoImage}
                          alt={
                            website.title
                          }
                        />
                      ) : (
                        website.title
                      )}

                    </div>

                    <div className="site-links">

                      <a href="#home">
                        Home
                      </a>

                      <a href="#about">
                        About
                      </a>

                      <a href="#products">
                        Products
                      </a>

                      <a href="#services">
                        Services
                      </a>

                      <a href="#contact">
                        Contact
                      </a>

                    </div>

                    <button className="nav-button">
                      {website.hero
                        ?.button ||
                        "Get Started"}
                    </button>

                  </nav>

                  {/* ==================
                      HERO
                  ================== */}

                  <section
                    id="home"
                    className="site-hero"
                    style={
                      heroImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${heroImage})`,
                          }
                        : {}
                    }
                  >

                    <div className="hero-content">

                      <p className="hero-label">
                        PREMIUM EXPERIENCE
                      </p>

                      <h1>
                        {
                          website.hero
                            ?.heading
                        }
                      </h1>

                      <p>
                        {
                          website.hero
                            ?.description
                        }
                      </p>

                      <button className="hero-button">
                        {
                          website.hero
                            ?.button
                        }
                      </button>

                    </div>

                    {!heroImage && (
                      <div className="hero-shape">
                        ✦
                      </div>
                    )}

                  </section>

                  {/* ==================
                      ABOUT
                  ================== */}

                  <section
                    id="about"
                    className="about-section"
                  >

                    <div>

                      <p className="section-label">
                        ABOUT US
                      </p>

                      <h2>
                        {
                          website.about
                            ?.title
                        }
                      </h2>

                    </div>

                    <p>
                      {
                        website.about
                          ?.description
                      }
                    </p>

                  </section>

                  {/* ==================
                      PRODUCTS
                  ================== */}

                  <section
                    id="products"
                    className="products-section"
                  >

                    <div className="section-heading">

                      <p className="section-label">
                        OUR COLLECTION
                      </p>

                      <h2>
                        Featured Products
                      </h2>

                    </div>

                    <div className="product-grid">

                      {products.map(
                        (
                          product,
                          index
                        ) => (

                          <div
                            className="product-card"
                            key={index}
                          >

                            <div className="product-image">

                              {product.image ? (

                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                />

                              ) : (

                                <span>
                                  Product Image
                                </span>

                              )}

                            </div>

                            <div className="product-info">

                              <h3>
                                {
                                  product.name
                                }
                              </h3>

                              <strong>
                                {
                                  product.price
                                }
                              </strong>

                              <button>
                                Add to Cart
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </section>

                  {/* ==================
                      SERVICES
                  ================== */}

                  <section
                    id="services"
                    className="services-section"
                  >

                    <div className="section-heading">

                      <p className="section-label">
                        WHAT WE OFFER
                      </p>

                      <h2>
                        Our Services
                      </h2>

                    </div>

                    <div className="service-grid">

                      {website.services?.map(
                        (
                          service,
                          index
                        ) => (

                          <div
                            className="service-card"
                            key={index}
                          >

                            <span>
                              0{index + 1}
                            </span>

                            <h3>
                              {
                                service.title
                              }
                            </h3>

                            <p>
                              {
                                service.description
                              }
                            </p>

                            <div className="arrow">
                              →
                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </section>

                  {/* ==================
                      CTA
                  ================== */}

                  <section
                    id="contact"
                    className="cta-section"
                  >

                    <p className="section-label">
                      GET STARTED
                    </p>

                    <h2>
                      {
                        website.cta
                          ?.heading
                      }
                    </h2>

                    <p>
                      {
                        website.cta
                          ?.description
                      }
                    </p>

                    <button className="hero-button">
                      {
                        website.cta
                          ?.button
                      }
                    </button>

                  </section>

                  {/* ==================
                      FOOTER
                  ================== */}

                  <footer className="site-footer">

                    <strong>
                      {website.title}
                    </strong>

                    <span>
                      © 2026 All Rights Reserved
                    </span>

                  </footer>

                </div>

              </section>

            </div>
          )}

      </main>

    </div>
  );
}

export default App;