import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <p className="mb-0">
        Ⓒ Made by Illia Stetsiurenko 2025.{" "}
        <a
          href="https://github.com/Stetsiurenko-Illia/UI_programming"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          Git repository
        </a>
      </p>
    </footer>
  );
}

export default Footer;
