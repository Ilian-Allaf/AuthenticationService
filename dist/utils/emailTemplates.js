"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTemplate = void 0;
function baseTemplate({ title, subtitle, buttonLink, buttonText, additionalText }) {
    return `
    <div style="background-color: #f3f4f6; padding: 20px;">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px;">${title}</h2>
        <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
          ${subtitle}
        </p>
        <a href="${buttonLink}" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 16px; font-weight: bold; transition: background-color 0.3s;">
          ${buttonText}
        </a>
        <p style="font-size: 14px; color: #718096; margin-top: 30px;">${additionalText}</p>
      </div>  
    </div>
  `;
}
exports.baseTemplate = baseTemplate;
