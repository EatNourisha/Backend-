import { createError } from "../utils";
import sgMail from "@sendgrid/mail";
import config from "../config";
import { Customer, customer } from "../models";

export async function sendGiftEmail(email: string, subject: string, htmlToSend: string, config: string, isTesting: boolean) {
  try {
    const result = await sgMail.send({
      from: {
        name: "Nourisha",
        email: "help@eatnourisha.com",
      },
      subject,
      to: email,
      html: htmlToSend,
    });

    // Ensure the result can optionally include a `key` property
    const resultWithKey = isTesting ? { ...result, key: config } : result;

    return resultWithKey;
  } catch (error) {
    console.log("Sendgrid Error:", error);
    throw createError(error.message, 500);
  }
}

export async function sendGiftBought(email: string, payload: any, isTesting: boolean) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  if (!cus) throw createError("Customer does not exist", 404);

  // if(payload?.gift_type === 'Happy Birthday') giftImage = 'https://res.cloudinary.com/drivfk4v3/image/upload/v1720681196/birthday_bq2drb.png';

  // if(payload?.gift_type === 'Get Well') giftImage = 'https://res.cloudinary.com/drivfk4v3/image/upload/v1720726855/get_well_hhi9vn.png';

  // if(payload?.gift_type === 'Thank You'  ) giftImage = 'https://res.cloudinary.com/drivfk4v3/image/upload/v1720726956/3_jztwty.png';

  // if(payload?.gift_type === 'Congratulation') giftImage = 'https://res.cloudinary.com/drivfk4v3/image/upload/v1720727007/4_siuvhx.png';

  let giftImage = ` ${payload?.imageUrl}`;
  const subject = `Your Nourisha Gift Card Purchase Confirmation`;

  const body = `<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta
      name="viewport"
      content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;"
    />
    <meta
      name="viewport"
      content="width=600,initial-scale = 2.3,user-scalable=no"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Welcome User</title>
    <link
      href="https://fonts.cdnfonts.com/css/food-buka-personal"
      rel="stylesheet"
    />
    <style>
      @media all {
        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 500;
          src: local("Foodbukapersonal Medium"), local("FiraSans-Medium"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 500;
          src: local("Foodbukapersonal Medium"), local("FiraSans-Medium"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
            U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
            U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100% !important;
        width: 100% !important;
        -webkit-font-smoothing: antialiased;
      }

      * {
        -ms-text-size-adjust: 100%;
      }

      @font-face {
        font-family: Inter;
        src: url(https://cvconnect.s3.amazonaws.com/static/fonts/Inter-Black.ttf);
      }
      @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
      @import url("https://fonts.cdnfonts.com/css/general-sans");
      @import url("https://fonts.cdnfonts.com/css/food-buka-personal");

      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #fafafa;
        padding-bottom: 10px;
        overflow-x: hidden;
      }

      .main {
        margin: 0 auto;
        width: 100%;
        max-width: 800px;
        border-spacing: 0;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 0px 0px 8px 8px;
      }
      .bordered {
        border-radius: 8px;
        border: 1px solid var(--Black-5, #cfcfce);
        background: var(--global-white, #fff);
      }
      .text {
        color: var(--Black-1, #0e0f0c);
        font-family: "General Sans", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-decoration: none !important;
      }
      .text-bold {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque", sans-serif;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .two-column .column {
        width: 100%;
        max-width: 300px;
        display: inline-block;
        vertical-align: top;
      }
      .caption-text {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque", sans-serif;
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.6px;
      }
      .footer-text {
        color: #6a7282;

        text-align: center;
        font-family: "Inter", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        letter-spacing: -0.72px;
      }

      .social-image {
        padding: 10px;
      }
      .markup-image {
        width: 500px;
      }
      .app-image {
        width: 200px;
      }

      .column {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        max-width: 300px;
      }

      .normal_text {
        color: #0e0f0c;
        font-family: "Inter", sans-serif;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        letter-spacing: -0.72px;
      }
      .bricolage_text {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque";
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.6px;
      }

      .general_sans_text {
        font-family: "General Sans", sans-serif;
      }

      .food-buka-personal {
        font-family: "Foodbukapersonal", sans-serif;
      }
      .large_padded {
        padding: 80px;
      }
      @media screen and (max-device-width: 767px),
        screen and (max-width: 767px) {
        .markup_image {
          display: none !important;
        }
        .app-image {
          width: 300px;
          display: block;
          margin-top: 1em;
        }

        tbody {
          width: 100%;
        }
        .large_padded {
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body class="wrapper">
    <table class="main">
      <tr style="width: 100%">
        <td
          style="
            padding: 1rem 5rem;
            background-color: #fe7e00;
            width: 100%;
            border-radius: 0.5rem 0.5rem 0rem 0rem;
            text-align: center;
          "
        >
          <img
            style="text-align: center; scale: 0.5"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720694527/Frame_1000002941_kw0yn8.png"
          />
        </td>
      </tr>
    </table>

    <table class="main" style="border-top: none">
      <tr style="width: 100%">
        <td style="width: 100%; height: 11.25rem">
          <img
            style="width: 100%; height: 100%"
            src="${giftImage}"
          />
        </td>
      </tr>
    </table>
    <table
      class="main large_padded bordered"
      style="background-color: #fff; border-top: none"
    >
      <tr>
        <td>
          <p
            class="food-buka-personal"
            style="
              font-size: 24px;
              color: #0e0f0c;
              font-family: Foodbukapersonal;
            "
          >
            Your Nourisha Gift Card Purchase Confirmation
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <image
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720726956/3_jztwty.png"
            style="width: 343px; margin-top: 32px; border-radius: 15.585px"
          />
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Dear ${cus?.first_name} ${cus?.last_name},
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Thank you for purchasing a Nourisha gift card! We're delighted to
            have you as a valued customer, and we hope this gift brings joy.
          </p>
        </td>
      </tr>

      <tr>
    <td>
    <p style="margin-top: 32px; font-weight: bold" class="normal_text">
      Here are the details of your gift card:
    </p>
    <p class="normal_text" style="margin-top: -20px">
      Gift Card Amount: £${payload?.amount}
    </p>
    <p class="normal_text" style="margin-top: -20px">
      Gift Card Code: ${payload?.code}
    </p>
    </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            You can use this gift card for any of our delicious offerings,
            including:
          </p>
          <ul style="margin-top: -20px">
            <li class="normal_text">
              Instant Meal Orders: Perfect for when you crave a specific dish
              and want it delivered immediately.
            </li>
            <li class="normal_text">
              Bulk Orders: Order large quantities of your favorite meals, like 5
              liters of our famous soups.
            </li>
          </ul>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            To redeem the gift card, simply enter the code at checkout on our
            website or app.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Thank you once again for choosing Nourisha. We look forward to
            serving you and your loved ones
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">Warm regards,</p>
          <p style="margin-top: -20px" class="normal_text">The Nourisha Team</p>
        </td>
      </tr>
    </table>

    <table
      style="margin-top: 12px; background-color: #ffff; border-bottom: none"
      class="main bordered"
    >
      <tr>
        <td style="text-align: center; padding-top: 32px">
          <p class="bricolage_text" style="text-align: center">
            Download the App
          </p>
          <p
            class="general_sans_text"
            style="
              text-align: center;
              font-size: 16px;
              width: 400px;
              margin-right: auto;
              margin-left: auto;
            "
          >
            Get our mobile app on any device you use on the App Store or Google
            Playstore
          </p>
        </td>
      </tr>
    </table>

    <table
      class="main"
      style="
        background-color: #fff;
        border-top: none;
        margin-top: 9px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-right: 50px;
        padding-left: 50px;
      "
    >
      <tr style="text-align: center; width: 10%; padding: 10px">
        <td style="text-align: center">
          <a
            href="https://apps.apple.com/gb/app/nourisha-kitchen-app/id1516715786?itsct=apps_box&itscg=30200&at=1207727597-0&ct=App+Store+Home+Page"
            target="_blank"
          >
            <img
              src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681363/app_store_rko93u.png"
              style="width: 160px; height: 60px"
            />
          </a>
        </td>
        <td style="text-align: center">
          <a href="https://play.google.com/store/apps/details">
            <img
              src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681642/play_store_pud7kw.png"
              style="width: 160px; height: 60px"
            />
          </a>
        </td>
      </tr>
    </table>
    <table class="main" style="margin-top: 5px !important; border: none">
      <tr>
        <td>
          <p
            class="general_sans_text"
            style="text-align: center; margin-top: 5px"
          >
            Contact Us
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p class="general_sans_text" style="text-align: center">
            House of Nourisha  | 71-75 Shelton Street  |  London
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p class="general_sans_text" style="text-align: center">
            WhatsApp: 07867059890 |  kitchen@eatnourisha.com  | 
            www.eatnourisha.com 
          </p>
        </td>
      </tr>
    </table>

    <table
      class="main"
      style="
        margin-top: 5px;
        border: none;
        width: 10%;
        margin-right: auto;
        margin-left: auto;
      "
    >
      <tr>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681415/facebook_ksc3cz.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681416/x_eybpsy.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681416/linkedin_em1ezk.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681415/instagram_e104j0.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  try {
    const result = await sgMail.send({
      from: {
        name: "Nourisha",
        email: "hello@eatnourisha.com",
      },
      subject,
      to: email,
      html: body,
    });

    // Ensure the result can optionally include a `key` property
    const resultWithKey = isTesting ? { ...result, key: config.SENDGRID_KEY } : result;

    return resultWithKey;
  } catch (error) {
    console.log("Sendgrid Error:", error);
    throw createError(error.message, 500);
  }
}

export async function sendGiftRecipient(email: string, payload: any, isTesting: boolean) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  if (!cus) throw createError("Customer does not exist", 404);

  const subject = `You've Received a Nourisha Gift Card! `;

  let giftImage = ` ${payload?.imageUrl}`;

  const body = `<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta
      name="viewport"
      content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;"
    />
    <meta
      name="viewport"
      content="width=600,initial-scale = 2.3,user-scalable=no"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Welcome User</title>
    <link
      href="https://fonts.cdnfonts.com/css/food-buka-personal"
      rel="stylesheet"
    />
    <style>
      @media all {
        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 500;
          src: local("Foodbukapersonal Medium"), local("FiraSans-Medium"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 500;
          src: local("Foodbukapersonal Medium"), local("FiraSans-Medium"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
            U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
            U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100% !important;
        width: 100% !important;
        -webkit-font-smoothing: antialiased;
      }

      * {
        -ms-text-size-adjust: 100%;
      }

      @font-face {
        font-family: Inter;
        src: url(https://cvconnect.s3.amazonaws.com/static/fonts/Inter-Black.ttf);
      }
      @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
      @import url("https://fonts.cdnfonts.com/css/general-sans");
      @import url("https://fonts.cdnfonts.com/css/food-buka-personal");

      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #fafafa;
        padding-bottom: 10px;
        overflow-x: hidden;
      }

      .main {
        margin: 0 auto;
        width: 100%;
        max-width: 800px;
        border-spacing: 0;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 0px 0px 8px 8px;
      }
      .bordered {
        border-radius: 8px;
        border: 1px solid var(--Black-5, #cfcfce);
        background: var(--global-white, #fff);
      }
      .text {
        color: var(--Black-1, #0e0f0c);
        font-family: "General Sans", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-decoration: none !important;
      }
      .text-bold {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque", sans-serif;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .two-column .column {
        width: 100%;
        max-width: 300px;
        display: inline-block;
        vertical-align: top;
      }
      .caption-text {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque", sans-serif;
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.6px;
      }
      .footer-text {
        color: #6a7282;

        text-align: center;
        font-family: "Inter", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        letter-spacing: -0.72px;
      }

      .social-image {
        padding: 10px;
      }
      .markup-image {
        width: 500px;
      }
      .app-image {
        width: 200px;
      }

      .column {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        max-width: 300px;
      }

      .normal_text {
        color: #0e0f0c;
        font-family: "Inter", sans-serif;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        letter-spacing: -0.72px;
      }
      .bricolage_text {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque";
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.6px;
      }

      .general_sans_text {
        font-family: "General Sans", sans-serif;
      }

      .food-buka-personal {
        font-family: "Foodbukapersonal", sans-serif;
      }
      .large_padded {
        padding: 80px;
      }
      @media screen and (max-device-width: 767px),
        screen and (max-width: 767px) {
        .markup_image {
          display: none !important;
        }
        .app-image {
          width: 300px;
          display: block;
          margin-top: 1em;
        }

        tbody {
          width: 100%;
        }
        .large_padded {
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body class="wrapper">
    <table class="main">
      <tr style="width: 100%">
        <td
          style="
            padding: 1rem 5rem;
            background-color: #fe7e00;
            width: 100%;
            border-radius: 0.5rem 0.5rem 0rem 0rem;
            text-align: center;
          "
        >
          <img
            style="text-align: center; scale: 0.5"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720694527/Frame_1000002941_kw0yn8.png"
          />
        </td>
      </tr>
    </table>

    <table class="main" style="border-top: none">
      <tr style="width: 100%">
        <td style="width: 100%; height: 11.25rem">
          <img
            style="width: 100%; height: 100%"
            src="${giftImage}"
          />
        </td>
      </tr>
    </table>
    <table
      class="main large_padded bordered"
      style="background-color: #fff; border-top: none"
    >
      <tr>
        <td>
          <p
            class="food-buka-personal"
            style="
              font-size: 24px;
              color: #0e0f0c;
              font-family: Foodbukapersonal;
            "
          >
          You've Received a Nourisha Gift Card🥳!
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <image
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720726956/3_jztwty.png"
            style="width: 343px; margin-top: 32px; border-radius: 15.585px"
          />
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Supriseeee🥳🎉,
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            You've recieved a Nourisha gift card from ${cus?.first_name} ${cus?.last_name}.Get ready to enjoy delightful flavors.
          </p>
        </td>
      </tr>

      <tr>
      <td>
      <p style="margin-top: 32px; font-weight: bold" class="normal_text">
        Here are the details of your gift card:
      </p>
      <p class="normal_text" style="margin-top: -20px">
        Gift Card Amount: £${payload?.amount}
      </p>
      <p class="normal_text" style="margin-top: -20px">
        Gift Card Code: ${payload?.code}
      </p>
      <p class="normal_text" style="margin-top: -20px">
        Sender Name:${cus?.first_name} ${cus?.last_name}
      </p>
      </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            You can use this gift card for any of our delicious offerings,
            including:
          </p>
          <ul style="margin-top: -20px">
            <li class="normal_text">
              Instant Meal Orders: Perfect for when you crave a specific dish
              and want it delivered immediately.
            </li>
            <li class="normal_text">
              Bulk Orders: Order large quantities of your favorite meals, like 5
              liters of our famous soups.
            </li>
          </ul>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            To redeem the gift card, simply enter the code at checkout on our
            website or app.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Thank you once again for choosing Nourisha. We look forward to
            serving you and your loved ones
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">Warm regards,</p>
          <p style="margin-top: -20px" class="normal_text">The Nourisha Team</p>
        </td>
      </tr>
    </table>

    <table
      style="margin-top: 12px; background-color: #ffff; border-bottom: none"
      class="main bordered"
    >
      <tr>
        <td style="text-align: center; padding-top: 32px">
          <p class="bricolage_text" style="text-align: center">
            Download the App
          </p>
          <p
            class="general_sans_text"
            style="
              text-align: center;
              font-size: 16px;
              width: 400px;
              margin-right: auto;
              margin-left: auto;
            "
          >
            Get our mobile app on any device you use on the App Store or Google
            Playstore
          </p>
        </td>
      </tr>
    </table>

    <table
      class="main"
      style="
        background-color: #fff;
        border-top: none;
        margin-top: 9px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-right: 50px;
        padding-left: 50px;
      "
    >
      <tr style="text-align: center; width: 10%; padding: 10px">
        <td style="text-align: center">
          <a
            href="https://apps.apple.com/gb/app/nourisha-kitchen-app/id1516715786?itsct=apps_box&itscg=30200&at=1207727597-0&ct=App+Store+Home+Page"
            target="_blank"
          >
            <img
              src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681363/app_store_rko93u.png"
              style="width: 160px; height: 60px"
            />
          </a>
        </td>
        <td style="text-align: center">
          <a href="https://play.google.com/store/apps/details">
            <img
              src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681642/play_store_pud7kw.png"
              style="width: 160px; height: 60px"
            />
          </a>
        </td>
      </tr>
    </table>
    <table class="main" style="margin-top: 5px !important; border: none">
      <tr>
        <td>
          <p
            class="general_sans_text"
            style="text-align: center; margin-top: 5px"
          >
            Contact Us
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p class="general_sans_text" style="text-align: center">
            House of Nourisha  | 71-75 Shelton Street  |  London
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p class="general_sans_text" style="text-align: center">
            WhatsApp: 07867059890 |  kitchen@eatnourisha.com  | 
            www.eatnourisha.com 
          </p>
        </td>
      </tr>
    </table>

    <table
      class="main"
      style="
        margin-top: 5px;
        border: none;
        width: 10%;
        margin-right: auto;
        margin-left: auto;
      "
    >
      <tr>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681415/facebook_ksc3cz.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681416/x_eybpsy.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681416/linkedin_em1ezk.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681415/instagram_e104j0.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  try {
    const result = await sgMail.send({
      from: {
        name: "Nourisha",
        email: "help@eatnourisha.com",
      },
      subject,
      to: email,
      html: body,
    });

    // Ensure the result can optionally include a `key` property
    const resultWithKey = isTesting ? { ...result, key: config.SENDGRID_KEY } : result;

    return resultWithKey;
  } catch (error) {
    console.log("Sendgrid Error:", error);
    throw createError(error.message, 500);
  }
}

export async function sendGiftSent(email: string, payload: any, isTesting: boolean) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  if (!cus) {
    throw createError("Customer does not exist", 404);
  }
  let giftImage = ` ${payload?.imageUrl}`;
  const subject = `Your Nourisha Gift Card Has Been Sent Successfully!`;

  const body = `<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta
      name="viewport"
      content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;"
    />
    <meta
      name="viewport"
      content="width=600,initial-scale = 2.3,user-scalable=no"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Welcome User</title>
    <link
      href="https://fonts.cdnfonts.com/css/food-buka-personal"
      rel="stylesheet"
    />
    <style>
      @media all {
        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 500;
          src: local("Foodbukapersonal Medium"), local("FiraSans-Medium"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 500;
          src: local("Foodbukapersonal Medium"), local("FiraSans-Medium"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
            U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 700;
          src: local("Foodbukapersonal Bold"), local("FiraSans-Bold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
            U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
            U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Foodbukapersonal";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Foodbukapersonal ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://res.cloudinary.com/drivfk4v3/raw/upload/v1720683178/FoodbukapersonalRegular_rrixwh.woff)
              format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
        }
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100% !important;
        width: 100% !important;
        -webkit-font-smoothing: antialiased;
      }

      * {
        -ms-text-size-adjust: 100%;
      }

      @font-face {
        font-family: Inter;
        src: url(https://cvconnect.s3.amazonaws.com/static/fonts/Inter-Black.ttf);
      }
      @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap");
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
      @import url("https://fonts.cdnfonts.com/css/general-sans");
      @import url("https://fonts.cdnfonts.com/css/food-buka-personal");

      .wrapper {
        width: 100%;
        table-layout: fixed;
        background-color: #fafafa;
        padding-bottom: 10px;
        overflow-x: hidden;
      }

      .main {
        margin: 0 auto;
        width: 100%;
        max-width: 800px;
        border-spacing: 0;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 0px 0px 8px 8px;
      }
      .bordered {
        border-radius: 8px;
        border: 1px solid var(--Black-5, #cfcfce);
        background: var(--global-white, #fff);
      }
      .text {
        color: var(--Black-1, #0e0f0c);
        font-family: "General Sans", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-decoration: none !important;
      }
      .text-bold {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque", sans-serif;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .two-column .column {
        width: 100%;
        max-width: 300px;
        display: inline-block;
        vertical-align: top;
      }
      .caption-text {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque", sans-serif;
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.6px;
      }
      .footer-text {
        color: #6a7282;

        text-align: center;
        font-family: "Inter", sans-serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        letter-spacing: -0.72px;
      }

      .social-image {
        padding: 10px;
      }
      .markup-image {
        width: 500px;
      }
      .app-image {
        width: 200px;
      }

      .column {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        max-width: 300px;
      }

      .normal_text {
        color: #0e0f0c;
        font-family: "Inter", sans-serif;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 150%; /* 27px */
        letter-spacing: -0.72px;
      }
      .bricolage_text {
        color: var(--Black-1, #0e0f0c);
        font-family: "Bricolage Grotesque";
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -1.6px;
      }

      .general_sans_text {
        font-family: "General Sans", sans-serif;
      }

      .food-buka-personal {
        font-family: "Foodbukapersonal", sans-serif;
      }
      .large_padded {
        padding: 80px;
      }
      @media screen and (max-device-width: 767px),
        screen and (max-width: 767px) {
        .markup_image {
          display: none !important;
        }
        .app-image {
          width: 300px;
          display: block;
          margin-top: 1em;
        }

        tbody {
          width: 100%;
        }
        .large_padded {
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body class="wrapper">
    <table class="main">
      <tr style="width: 100%">
        <td
          style="
            padding: 1rem 5rem;
            background-color: #fe7e00;
            width: 100%;
            border-radius: 0.5rem 0.5rem 0rem 0rem;
            text-align: center;
          "
        >
          <img
            style="text-align: center; scale: 0.5"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720694527/Frame_1000002941_kw0yn8.png"
          />
        </td>
      </tr>
    </table>

    <table class="main" style="border-top: none">
      <tr style="width: 100%">
        <td style="width: 100%; height: 11.25rem">
          <img
            style="width: 100%; height: 100%"
            src="${giftImage}"
          />
        </td>
      </tr>
    </table>
    <table
      class="main large_padded bordered"
      style="background-color: #fff; border-top: none"
    >
      <tr>
        <td>
          <p
            class="food-buka-personal"
            style="
              font-size: 24px;
              color: #0e0f0c;
              font-family: Foodbukapersonal;
            "
          >
          Your Nourisha Gift Card Has Been Sent Successfully!
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <image
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720726956/3_jztwty.png"
            style="width: 343px; margin-top: 32px; border-radius: 15.585px"
          />
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Dear ${cus?.first_name},
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            We are thrilled to inform you that the your Nourisha gift card has been sent successfully!.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px; font-weight: bold" class="normal_text">
            Here are the details of your gift card:
          </p>
          <p class="normal_text" style="margin-top: -20px">
            Gift Card Amount: £${payload?.amount}
          </p>
          <p class="normal_text" style="margin-top: -20px">
            Gift Card Code: ${payload?.code}
          </p>
          <p class="normal_text" style="margin-top: -20px">
            Reciever Email:${payload?.reciever_email} 
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            The reciever can use this gift card for any of our delicious offerings,
            including:
          </p>
          <ul style="margin-top: -20px">
            <li class="normal_text">
              Instant Meal Orders: Perfect for when you crave a specific dish
              and want it delivered immediately.
            </li>
            <li class="normal_text">
              Bulk Orders: Order large quantities of your favorite meals, like 5
              liters of our famous soups.
            </li>
          </ul>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            To redeem the gift card, simply enter the code at checkout on our
            website or app.
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">
            Thank you once again for choosing Nourisha. We look forward to
            serving you and your loved ones
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p style="margin-top: 32px" class="normal_text">Warm regards,</p>
          <p style="margin-top: -20px" class="normal_text">The Nourisha Team</p>
        </td>
      </tr>
    </table>

    <table
      style="margin-top: 12px; background-color: #ffff; border-bottom: none"
      class="main bordered"
    >
      <tr>
        <td style="text-align: center; padding-top: 32px">
          <p class="bricolage_text" style="text-align: center">
            Download the App
          </p>
          <p
            class="general_sans_text"
            style="
              text-align: center;
              font-size: 16px;
              width: 400px;
              margin-right: auto;
              margin-left: auto;
            "
          >
            Get our mobile app on any device you use on the App Store or Google
            Playstore
          </p>
        </td>
      </tr>
    </table>

    <table
      class="main"
      style="
        background-color: #fff;
        border-top: none;
        margin-top: 9px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-right: 50px;
        padding-left: 50px;
      "
    >
      <tr style="text-align: center; width: 10%; padding: 10px">
        <td style="text-align: center">
          <a
            href="https://apps.apple.com/gb/app/nourisha-kitchen-app/id1516715786?itsct=apps_box&itscg=30200&at=1207727597-0&ct=App+Store+Home+Page"
            target="_blank"
          >
            <img
              src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681363/app_store_rko93u.png"
              style="width: 160px; height: 60px"
            />
          </a>
        </td>
        <td style="text-align: center">
          <a href="https://play.google.com/store/apps/details">
            <img
              src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681642/play_store_pud7kw.png"
              style="width: 160px; height: 60px"
            />
          </a>
        </td>
      </tr>
    </table>
    <table class="main" style="margin-top: 5px !important; border: none">
      <tr>
        <td>
          <p
            class="general_sans_text"
            style="text-align: center; margin-top: 5px"
          >
            Contact Us
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p class="general_sans_text" style="text-align: center">
            House of Nourisha  | 71-75 Shelton Street  |  London
          </p>
        </td>
      </tr>

      <tr>
        <td>
          <p class="general_sans_text" style="text-align: center">
            WhatsApp: 07867059890 |  kitchen@eatnourisha.com  | 
            www.eatnourisha.com 
          </p>
        </td>
      </tr>
    </table>

    <table
      class="main"
      style="
        margin-top: 5px;
        border: none;
        width: 10%;
        margin-right: auto;
        margin-left: auto;
      "
    >
      <tr>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681415/facebook_ksc3cz.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681416/x_eybpsy.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681416/linkedin_em1ezk.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
        <td>
          <img
            class="social-image"
            src="https://res.cloudinary.com/drivfk4v3/image/upload/v1720681415/instagram_e104j0.png"
            style="width: 32px; height: 32px; margin-right: 10px"
          />
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  try {
    const result = await sgMail.send({
      from: {
        name: "Nourisha",
        email: "help@eatnourisha.com",
      },
      subject,
      to: email,
      html: body,
    });

    // Ensure the result can optionally include a `key` property
    const resultWithKey = isTesting ? { ...result, key: config.SENDGRID_KEY } : result;

    return resultWithKey;
  } catch (error) {
    console.log("Sendgrid Error:", error);
    throw createError(error.message, 500);
  }
}
