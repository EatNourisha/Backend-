import customer, { Customer } from "../../models/customer";
import { mailJetSendMail } from "../../config/mailjet";
import { Order, order } from "../../models";
import sgMail from "@sendgrid/mail";

export async function welcomeEmail1(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Welcome To Nourisha`;
  
    const body = 
    `
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }
      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .green-section {
        background-color: #28640a;
        color: #ffffff;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td style="background-color: #ffffff">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/pa88wayo43zai6cxworw"
                  alt="Welcome to Nourisha"
                  style="width: 100%"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block" style="background-color: #fff">
                <p>Dear ${cus.first_name},</p>
                <h1>Welcome to Nourisha</h1>
                <p>Your Culinary Gateway to Intercontinental Dishes!</p>
                <p>
                  Are you craving rich Intercontinental cuisines? Look no
                  further! Nourisha brings you a diverse menu of delicious
                  chef-cooked meals, delivered right to your doorstep. Whether
                  you're from Africa, Asia or Europe, our flavours knows no
                  boundaries. Taste convenience with our meal-prep and food
                  delivery meal plans, available in all UK cities.
                </p>
                <p>
                  As a thank you for joining our community, use the promo code
                  <strong>SIGNUPSAVE5</strong> at checkout to enjoy 5% off your
                  first order!
                </p>
              </td>
            </tr>
            <!-- Menu Section -->
            <tr>
              <td
                style="
                  background-image: url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ssqpfnzgqctysyw3q139');
                  background-repeat: no-repeat;
                  background-position: bottom right;
                "
                class="green-section content-block"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <h2>Our Menu - Diverse Tastes for Every Palatee</h2>
                      <p style="font-size: 24px">
                        Our meal plan options offer:
                      </p>
                      <ul
                        style="
                          font-size: 18px;
                          margin-left: 20px;
                          margin-bottom: 32px;
                          margin-top: 16px;
                        "
                      >
                        <li style="margin: 20px 0">
                          10 savoury meals for 5 days [Mon-Friday]
                        </li>
                        <li style="margin: 20px 0">
                          14 mouth-watering meals for 7 days [Mon - Sun]
                        </li>
                        <li style="margin: 20px 0 0 0">
                          56 sumptuous meals over 4 weeks [delivered weekly]
                        </li>
                      </ul>
                      <p>
                        Choose from African meal plans from £80/week or
                        Asian-European delights from £71/week - delivery
                        included, of course!
                      </p>
                    </td>
                    <td class="stack-column" width="40%">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/eylh3dz1yffyg1szhgac"
                        alt="Delicious meal example"
                        style="width: 100%"
                      />
                    </td>
                  </tr>
                </table>

                <!-- Flexible Options Section -->
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin-top: 30px"
                >
                  <tr>
                    <td>
                      <h2>Flexible Options for the Spontaneous Foodie</h2>
                      <p>
                        Flexible Options for the Spontaneous Foodie Not ready
                        for a meal plan? No problem! Our pay-as-you-go model
                        lets you order whenever you wish, with deliveries within
                        24-48 hours. Starting at just £6/plate, it's the perfect
                        choice for those spontaneous meal decisions.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Join Section -->
            <tr>
              <td class="yellow-section content-block">
                <h2>Join the Nourisha Clan aka #NourishedFoodies</h2>
                <h3 style="color: #0e0f0c">Why choose Nourisha?</h3>
                <ul
                  style="margin-left: 20px; margin-bottom: 20px; color: #0e0f0c"
                >
                  <li>
                    We're not just about food; we're about 10X better nutrition
                    & quality of life
                  </li>
                  <li>
                    We offer convenience, affordability, and accessibility
                  </li>
                  <li>With every referral, you earn £10!</li>
                  <li>
                    Your Personal Cheerleader in the Kitchen: Imagine coming
                    home to a chef-cooked meal that's both nutritious and
                    tantalising. That's the Nourisha promise
                  </li>
                </ul>
                <p style="color: #0e0f0c">
                  Ready to become a part of our clan and dive into a world of
                  flavour? Order from our menu today via the web or the Nourisha
                  app and let Nourisha take care of the rest. Every meal is a
                  masterpiece waiting for you.
                </p>
                <p style="color: #0e0f0c">
                  Yours Deliciously,<br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:07867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `
  ;
    // await mailJetSendMail(
    //   body,
    //   `${subject}`,
    //   [`${email}`]
    // );

    await sgMail.send({
      from: {
        name: "Nourisha",
        email: "hello@eatnourisha.com",
      },
      subject,
      to: email,
      html: body,
    });
  
  };
  
  export async function welcomeEmail2(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus.first_name}, Secret's Out! Unluck Nourisha's App & Discover Hidden Gems`;
  
    const body = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      li,
      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: #def54c;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        li,
        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>Hey there, ${cus.first_name},</p>
                      <p>
                        Ready to dive into a world of delicious convenience that
                        can 10x the quality of your life? Get started with the
                        Nourisha App today! It's your gateway to chef-cooked,
                        mouth-watering intercontinental meals delivered right to
                        your doorstep.
                      </p>
                      <p>
                        Don't wait, this offer expires in 24 hours. Order now,
                        and let's get cooking!
                      </p>
                      <h3 style="color: #125309">
                        Here's how to begin your culinary adventure:
                      </h3>
                      <p>Your Simple Step-by-Step Guide</p>
                      <ul style="margin: 0 0 20px 40px">
                        <li>
                          Download & Login: Get the app from the App Store or
                          Google Play and create an account.
                        </li>
                        <li>
                          Explore Our Weekly & Monthly Meal Plans: Select a meal
                          type (African meal or Asian & European meal) select
                          your meal plan and select from our wide range of
                          meals.
                        </li>
                        <li>
                          Nutritional Info: Check meal details for nutritional
                          values.
                        </li>
                        <li>
                          Schedule Delivery(African): Weekday or Weekend
                          Delivery.
                        </li>
                        <li>
                          Weekly Scheduled Delivery Date for Asian & European
                          meal
                        </li>
                        <li>
                          Coupon Code: Enter a coupon code to get amazing offers
                          and discounts
                        </li>
                        <li>
                          Coupon Code: Enter a coupon code to get amazing offers
                          and discounts
                        </li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block"
                style="background-color: #fff"
                width="40%"
              >
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730492393/email_template/q9iyc70zgzfqmqrmqsgd.png"
                  alt="Welcome to Nourisha"
                  style="width: 100%"
                />
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p>
                  Yours Deliciously,<br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #def54c"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function welcomeEmail3(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = 
    `
    ${cus.first_name}, See What People Are Saying About Us
  `
  ;
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      li,
      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #f2f4f7;
        color: #000;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name},</strong></p>
                      <p>
                        We can't help but share the love pouring in from some of
                        our satisfied customers with you. See what they are
                        saying about us:
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="border-collapse: separate; border-spacing: 8px"
                >
                  <tr>
                    <td class="stack-column black-section">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730492741/email_template/recxddtriwltvy1ria4e.png"
                        alt=""
                        style="
                          display: block;
                          margin: 0 0 12px 0;
                          width: 100%;
                          max-width: 128px;
                        "
                      />
                      <p><b>Impressive and Convenient</b></p>
                      <p>
                        Recently tried a meal plan from Nourisha, and it was
                        impressive. The food was fresh, flavorful, and in good
                        portion. Highly recommend.
                      </p>
                      <p>
                        <b>Earl Joey</b
                        ><span style="margin-left: 6px">25 Apr 2024</span>
                      </p>
                    </td>
                    <td class="stack-column black-section">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730492741/email_template/recxddtriwltvy1ria4e.png"
                        alt=""
                        style="
                          display: block;
                          margin: 0 0 12px 0;
                          width: 100%;
                          max-width: 128px;
                        "
                      />
                      <p><b>Good Food</b></p>
                      <p>
                        Good food, spicy, offers a taste of home away from
                        home.Also thanks to Victoria for answering many
                        questions before the order😁
                      </p>
                      <p>
                        <b>Freeborn Ehirhere</b
                        ><span style="margin-left: 6px">5 June 2024</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column black-section">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730492741/email_template/recxddtriwltvy1ria4e.png"
                        alt=""
                        style="
                          display: block;
                          margin: 0 0 12px 0;
                          width: 100%;
                          max-width: 128px;
                        "
                      />
                      <p><b>Good service, Better Food</b></p>
                      <p>
                        I got one week meal plan, lunch and dinner. The food all
                        looks good and taste even better. Love the packaging and
                        customer service, delivered early in th....
                      </p>
                      <p>
                        <b>Funmilola Usman</b
                        ><span style="margin-left: 6px">25 Apr 2024</span>
                      </p>
                    </td>
                    <td class="stack-column black-section">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730492741/email_template/recxddtriwltvy1ria4e.png"
                        alt=""
                        style="
                          display: block;
                          margin: 0 0 12px 0;
                          width: 100%;
                          max-width: 128px;
                        "
                      />
                      <p><b>On time delivery</b></p>
                      <p>
                        The delivery was on time and meals all delicious.
                        Customer service was excellent too, no reason not to
                        order really. And oh, I got free drinks and fruits
                        too!🥳
                      </p>
                      <p>
                        <b>Chiamaka Ubaka</b
                        ><span style="margin-left: 6px">5 June 2024</span>
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column">
                      <p style="margin: 24px auto">
                        These heartwarming testimonials and so much more fuel
                        our passion and inspire us every day. It's our solemn
                        promise to maintain the highest standards in our meals,
                        so you can stay healthy, nourished and empowered to
                        smash your goals and 10x the quality of your lifestyle.
                      </p>
                      <p>
                        If you do not have a meal plan running yet, now's the
                        perfect time to get started with your weekly or monthly
                        meal plan. They usually start from £70 - £80/ 5 days
                        meal plan. £95 - £100 for 7 days meal plan and £375 -
                        £400/month but all this love has got us feeling
                        generous. So, we are giving you a 5% discount! Use the
                        code SIGNUPSAVE5 within 7 days of receiving this email
                        to claim your gift.
                      </p>
                      <p style="margin-bottom: 0">
                        Click the button below to get started with a meal plan
                        now.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="
                          background: #def54c;
                          color: #000;
                          display: inline-block;
                          margin: 32px auto;
                        "
                        href="https://nourisha.co.uk/menu"
                      >
                        Start Exploring Our Dishes
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        We can't wait to receive your orders for the week. Till
                        we're in your inbox again. Have a fabulous week ahead.
                      </p>
                      <p style="margin-bottom: 0;">
                        With Foodie Love,<br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function welcomeEmail4(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Welcome To Nourisha! Enjoy 5% Off Your First Order 🎉`;
  
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }

      /* Reset styles */
      body,
      table,
      td,
      div,
      h1,
      h2,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td style="background-color: #ffffff">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/pa88wayo43zai6cxworw"
                  alt="Welcome to Nourisha"
                  style="width: 100%"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block" style="background-color: #ffffff">
                <p>Dear ${cus.first_name},</p>
                <h1>Welcome to Nourisha</h1>
                <p>
                  Welcome to Nourisha! We're thrilled to have you join our
                  community of food enthusiasts. As a token of our appreciation
                  for choosing Nourisha, we'd like to offer you 5% off your
                  first order! Simply use the promo code
                  <strong>SIGNUPSAVE5</strong> at checkout to enjoy.
                </p>
                <p>
                  Nourisha is more than just a meal prep service, it's your
                  culinary gateway to intercontinental dishes. Our menu features
                  a diverse range of delicious, chef-cooked meals that cater to
                  all tastes and preferences. From traditional African, Asian
                  and European Dishes to fusion creations, there's something for
                  everyone.
                </p>
                <p>
                  With our flexible meal plans and convenient pay-as-you-go
                  service, Nourisha makes it easy to enjoy the convenience of
                  home-cooked meals without the hassle.
                </p>
                <p>
                  We're committed to providing you with the highest quality food
                  and exceptional customer service. Thank you for choosing
                  Nourisha.
                </p>
                <p>
                  Happy eating!<br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #ffffff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #def54c"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:07867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function welcomeEmail5(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = 
    `
    Ready For Your First Nourish Meal? We're Here To Help!
  `
  ;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td align="center" class="yellow-section content-block">
                <h2>
                  Is Nourisha Wetting Your Appetite?
                  <span style="font-size: 70px; vertical-align: middle"
                    >🤤</span
                  >
                </h2>
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block" style="background-color: #fff">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>Hey there, ${cus.first_name},</p>
                      <p>
                        We noticed you've taken your first steps into the world
                        of Nourisha, where every meal is a masterpiece. But we
                        can't help but wonder, what's been your favourite part
                        so far? You've been savouring the idea of our
                        chef-cooked meals but haven't placed your first order.
                        Is there something holding you back?
                      </p>
                      <p>
                        Should you need a helping hand or have any questions,
                        our customer support team is just a
                        <a href="https://wa.me/4407931621298">WhatsApp</a>
                        message away: <strong>07931621298</strong> or
                        <strong>07867059890</strong>
                        Don't hesitate to reach out!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fff; color: #125309"
                        aria-label="Chat on WhatsApp"
                        href="https://wa.me/4407931621298"
                        >Go to WhatsApp
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3 Reasons Section -->
            <tr>
              <td
                class="cream-section content-block"
                style="
                  background-image: url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/jsi2pyxlucwgpul2yzok');
                  background-repeat: no-repeat;
                  background-position: bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <h2 style="color: #28640a">
                        Still pondering if Nourisha is your best bet? Here are 3
                        reasons why we are your only bet:
                      </h2>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column" width="60%">
                      <h3>Order and save</h3>
                      <p style="font-size: 16px; width: 100%; max-width: 495px">
                        Ready for a hassle-free week? Our 5-day meal plan brings
                        10 delightful meals straight to your door each week,
                        while our 7-day meal plan delivers 14 yummy delicacies
                        to you and saves you from paying exorbitant fees on fast
                        food apps, restaurants and you also get to enjoy amazing
                        discounts off all meal plans.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <table>
                        <tr>
                          <td class="stack-column" width="50%">
                            <img
                              src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/q2xu1a9y7ufqwqlu5x42"
                              alt=""
                            />
                          </td>
                          <td class="stack-column" width="50%">
                            <h3>Flexibility at Your Fingertips</h3>
                            <p style="font-size: 16px">
                              Prefer to order as you go? Our diverse menu awaits
                              your cravings, any day, anytime, anywhere.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column">
                      <h3>Perks Galore</h3>
                      <p style="font-size: 16px; width: 100%; max-width: 295px">
                        Free delivery across UK cities, £10 for every pal you
                        bring into the Nourisha family, and more!
                      </p>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td>
                      <p>
                        Whether you're eyeing a weekly/monthly meal plan or a
                        one-time indulgence, we're here to make it as smooth and
                        savoury as possible. Tap into the convenience of
                        Nourisha and let us spice up your mealtime! <br />
                        Ready to dive in? Check out our menu and let your taste
                        buds lead the way.
                      </p>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td align="center" class="stack-column" width="60%">
                      <a
                        class="ctaButton"
                        style="background: #def54c; color: #000"
                        href="https://nourisha.co.uk/menu"
                      >
                        Get delicious African, Asian and European meals
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p>
                  🥂Here's to flavours that bring us together,<br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #def54c"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function welcomeEmail6(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Get A Taste Of Stree-Free Dining! 5% Off Your First Order 🍲`
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: #def54c;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td align="center" class="black-section" style="padding: 16px">
                <h2>
                  <span
                    style="font-size: 70px; vertical-align: middle; margin: 0"
                    >🎁</span
                  >We have a little welcome gift for you!<span
                    style="font-size: 70px; vertical-align: middle"
                    >🎁</span
                  >
                </h2>
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>Hey there, ${cus.first_name},</p>
                      <p>
                        Remember that delicious stress-free life we promised? We
                        want to give you a little taste right now! Use code
                        <strong>SIGNUPSAVE5</strong> at checkout to get 5% off
                        your first Nourisha order. Treat yourself to a week of
                        tasty chef-cooked meals, on us!
                      </p>
                      <p>
                        Don't wait, this offer expires in 24 hours. Order now,
                        and let's get cooking!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #def54c; color: black"
                        aria-label="Claim Welcome Discount Now"
                        href="https://wa.me/4407931621298"
                        >Claim Welcome Discount Now
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p>
                  Yours Deliciously,<br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #def54c"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function welcomeEmail7(email: string, payload: any) {
    await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Welcome To Nourisha! Extraordinary Flavors Await You 🍲`
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: #def54c;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td align="center" class="black-section" style="padding: 16px">
                <h2>Ready for a Taste of Adventure?</h2>
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block" style="background-color: #fff">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>Dear NourishedFoodie,</p>
                      <p>
                        Why settle for the ordinary when you can experience the
                        extraordinary with every bite? Welcome to Nourisha,
                        where we bring a world of flavours right to your
                        doorstep.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3 Reasons Section -->
            <tr>
              <td
                class="cream-section content-block"
                style="
                  background-image: url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/jsi2pyxlucwgpul2yzok');
                  background-repeat: no-repeat;
                  background-position: bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <h2 style="color: #28640a">Here's the scoop:</h2>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column" width="60%">
                      <h3>Nutrition & Quality</h3>
                      <p style="font-size: 16px; width: 100%; max-width: 495px">
                        Upgrade your dining with meals that are not just
                        delicious but also packed with nutrients—because you
                        deserve the best.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <table>
                        <tr>
                          <td class="stack-column" width="50%">
                            <img
                              src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/q2xu1a9y7ufqwqlu5x42"
                              alt=""
                            />
                          </td>
                          <td class="stack-column" width="50%">
                            <h3>Utmost Convenience</h3>
                            <p style="font-size: 16px">
                              From selecting your favourite African to Asian or
                              European meals to seamless delivery, we've
                              streamlined every step. You click, we deliver!
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column">
                      <h3>Unbeatable prices</h3>
                      <p style="font-size: 16px; width: 100%; max-width: 295px">
                        Indulge in the richness of delicacies without breaking
                        the bank. We promise affordability and accessibility, no
                        matter your location in the UK.
                      </p>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td>
                      <b>And we don't stop there. NourishedFoodies enjoy: </b>
                      <ul>
                        <li>Complimentary delivery across all UK cities.</li>
                        <li>
                          Customizable meal plans that fit your lifestyle.
                        </li>
                        <li>Exclusive access to special deals and offers.</li>
                        <li>A £10 thank you for every friend you refer.</li>
                      </ul>
                    </td>
                  </tr>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td align="center" class="stack-column" width="60%">
                      <a
                        class="ctaButton"
                        style="
                          background: #def54c;
                          color: #000;
                          font-size: 20px;
                        "
                        href="https://nourisha.co.uk/menu"
                      >
                        Select a Meal Plan Now
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block" style="background-color: #fff">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="mobile-text-center">
                      <p>
                        Not ready for a meal plan? No problem! Our pay-as-you-go
                        orders are just a click away. Join the NourishedFoodies
                        clan now and transform your mealtime into a celebration
                        of taste and convenience.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" class="stack-column" width="60%">
                      <a
                        class="ctaButton"
                        style="
                          border-radius: 32px;
                          border: 1.5px solid #000;
                          background: #fe7e00;
                          box-shadow: 1px 6px 0px 0px #010100;
                          color: #fff;
                        "
                        href="https://nourisha.co.uk/menu"
                      >
                        Order now
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top: 32px">
                      <p>
                        Yours Deliciously,<br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #def54c"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function welcomeEmail8(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `
    New Season, New Flavors, Kick Off With Special Nourisha Discounts
    `;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Welcome to Nourisha</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 16px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td style="background-color: #ffffff">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/pa88wayo43zai6cxworw"
                  alt="Welcome to Nourisha"
                  style="width: 100%"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block" style="background-color: #ffffff">
                <p>Dear ${cus.first_name},</p>
                <h1>Welcome to Nourisha</h1>
                <p>
                  We're excited to have you join us during this [Season] season.
                </p>
                <p>To celebrate, we're offering two special Discounts.</p>
                <ol>
                  <li>Save 5% on your first order</li>
                  <li>Loyalty Reward - 99% off every 5th meal plan</li>
                </ol>
                <p>
                  Nourisha brings you the best of African, Asian and European
                  cuisine, delivered right to your doorstep. Our seasonal menu
                  features fresh, in-season ingredients that capture the essence
                  of the season.
                </p>
                <p>
                  Whether you're craving a hearty stew, a refreshing salad, or a
                  sweet treat, Nourisha has something to satisfy your cravings.
                </p>
                <p>
                  Thank you for choosing Nourisha. We look forward to serving
                  you delicious, nutritious meals.<br />Happy eating!<br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #ffffff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #def54c"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:07867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment1(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
    const _order = await order.findById(payload.orderId).populate( [
        {path: "customer"},
        {path: "orderExtras.item"},
        {path: "orderExtras.protein"},
        {path: "orderExtras.swallow"},
 
      ]).lean<Order>().exec()
  
    const subject = `${cus.first_name}, You Left Something Tasty In Your Cart! Don't Miss Out`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We noticed that you left a tasty meal in your cart. We
                        totally get it, life gets busy sometimes. But we just
                        wanted to remind you that your delicious, chef-cooked
                        meal is patiently waiting for you to complete your
                        order.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="10"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                        ${_order?.orderExtras?.slice(0,3).map((ord) => {
                          return `                         
                           <td
                            class="stack-column"
                            style="
                              background-color: white;
                              padding: 10px;
                              border-radius: 12px;
                              margin-top: 10px;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tr>
                                <td class="stack-column-center">
                                  <img
                                    src="${ord.item.image_url}"
                                    alt="food"
                                    style="
                                      margin-bottom: 12px;
                                      display: block;
                                      border-radius: 8px;
                                    "
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td class="stack-column">
                                  <p
                                    style="
                                      color: #030517;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 800;
                                    "
                                  >
                                    £${ord.item.price.amount}.00
                                  </p>
                                  <p
                                    style="
                                      margin-bottom: 0;
                                      font-size: 18px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${ord.item.name}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>

                        `;
                      }).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Imagine sinking your teeth into tender, succulent
                        Zimbabwean, Indian, Italian, and Asian meals, or
                        savoring the rich taste of chef-cooked Nigerian Jollof,
                        soups and swallows. Our chefs pour their heart and soul
                        into preparing these authentic intercontinental dishes,
                        just for you.
                      </p>
                      <p>
                        Don't miss out on the convenience of having
                        restaurant-quality meals delivered straight to your
                        doorstep. Simply click the button below to continue your
                        order and satisfy your craving for mouth watering
                        Intercontinental delicacies!
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="https://www.eatnourisha.com"
                        >Complete Your Order Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        We can't wait to nourish you with our delightful meals!
                      </p>
                      <p style="margin-bottom: 0">
                        Yours Deliciously, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    // await mailJetSendMail(
    //   body,
    //   `${subject}`,
    //   [`${email}`]
    // );
 
    await sgMail.send({
      from: {
        name: "Nourisha",
        email: "hello@eatnourisha.com",
      },
      subject,
      to: email,
      html: body,
    });

  };
  
  export async function cartAbandonment2(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
      const _order = await order.findById(payload.orderId).populate( [
        {path: "customer"},
        {path: "orderExtras.item"},
        {path: "orderExtras.protein"},
        {path: "orderExtras.swallow"},
 
      ]).lean<Order>().exec()

    const subject = `Still Thinking About Your Nourisha Feast?`;
  
const body = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We couldn't help but notice you've got a taste for our
                        delicious meals. Your selected dishes are still sizzling
                        in your cart, ready to bring a burst of flavour to your
                        taste buds. We understand that sometimes clicking
                        'order' is the hardest part. Perhaps you have questions
                        or need a nudge? Whatever the reason, we're here to
                        help.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="10"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                        ${_order?.orderExtras?.slice(0,3).map((ord) => {
                          return `                          
                          <td
                            class="stack-column"
                            style="
                              background-color: white;
                              padding: 10px;
                              border-radius: 12px;
                              margin-top: 10px;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tr>
                                <td class="stack-column-center">
                                  <img
                                    src="${ord.item.image_url}"
                                    alt="food"
                                    style="
                                      margin-bottom: 12px;
                                      display: block;
                                      border-radius: 8px;
                                    "
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td class="stack-column">
                                  <p
                                    style="
                                      color: #030517;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 800;
                                    "
                                  >
                                    £${ord.item.price.amount}.00
                                  </p>
                                  <p
                                    style="
                                      margin-bottom: 0;
                                      font-size: 18px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${ord.item.name}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>

                        `;
                      }).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Why wait? Dive into the convenience of Nourisha's meals
                        today and relish every bite without a fuss. If you're
                        hesitating, let's chat! Our
                        <strong
                          ><a
                            style="color: #000"
                            href="https://wa.me/4407931621298"
                            >WhatsApp</a
                          ></strong
                        >
                        support is ready to assist with any concerns you might
                        have.
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fff; color: #125309"
                        aria-label="Chat on WhatsApp"
                        href="https://wa.me/4407931621298"
                        >Go to WhatsApp
                        <img
                          src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730470381/email_template/aniin6ump6an1kubm7fi.png"
                          style="
                            display: inline-block;
                            width: 24px;
                            vertical-align: middle;
                            margin-left: 4px;
                          "
                          alt=""
                        />
                      </a>
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Go Back To Cart
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Complete your order now and let us take care of the
                        rest. Your taste buds will thank you!
                      </p>
                      <p style="margin-bottom: 0">
                        Yummily Yours, <br />The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  
  export async function cartAbandonment3(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
      const _order = await order.findById(payload.orderId).populate( [
        {path: "customer"},
        {path: "orderExtras.item"},
        {path: "orderExtras.protein"},
        {path: "orderExtras.swallow"},
 
      ]).lean<Order>().exec()

    const subject = `Hi ${cus.first_name}, Your Nourisha Meal Cart Misses You!
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        Did you know that your cart is the gateway to a world of
                        culinary wonders? It seems you've left behind a treasure
                        trove of delicious meals. We're here to remind you that
                        your chosen meals are just one click away from becoming
                        a reality.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="10"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                        ${_order?.orderExtras?.slice(0,3).map((ord) => {
                          return `                          
                          <td
                            class="stack-column"
                            style="
                              background-color: white;
                              padding: 10px;
                              border-radius: 12px;
                              margin-top: 10px;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tr>
                                <td class="stack-column-center">
                                  <img
                                    src="${ord.item.image_url}"
                                    alt="food"
                                    style="
                                      margin-bottom: 12px;
                                      display: block;
                                      border-radius: 8px;
                                    "
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td class="stack-column">
                                  <p
                                    style="
                                      color: #030517;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 800;
                                    "
                                  >
                                    £${ord.item.price.amount}.00
                                  </p>
                                  <p
                                    style="
                                      margin-bottom: 0;
                                      font-size: 18px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${ord.item.name}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>

                        `;
                      }).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Return to your Cart and let's embark on this flavorful
                        journey together. Use the promo code
                        <strong>SIGNUPSAVE5</strong> at checkout to enjoy 5% off
                        your first meal! Your next favourite dish is waiting to
                        be discovered!
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Complete Your Order Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column">
                      <p>
                        Feeling unsure? If there's anything making you hesitate,
                        we'd love to hear about it. Our helpful and proactive
                        <strong
                          ><a
                            style="color: #000"
                            href="https://wa.me/4407931621298"
                            >WhatsApp</a
                          ></strong
                        >
                        support team is on standby to guide you through any
                        obstacles and answer your queries
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fff; color: #125309"
                        aria-label="Chat on WhatsApp"
                        href="https://wa.me/4407931621298"
                        >Go to WhatsApp
                        <img
                          src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730470381/email_template/aniin6ump6an1kubm7fi.png"
                          style="
                            display: inline-block;
                            width: 24px;
                            vertical-align: middle;
                            margin-left: 4px;
                          "
                          alt=""
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p style="margin-bottom: 0">
                        Still Yours, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment4(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
      const _order = await order.findById(payload.orderId).populate( [
        {path: "customer"},
        {path: "orderExtras.item"},
        {path: "orderExtras.protein"},
        {path: "orderExtras.swallow"},
 
      ]).lean<Order>().exec()

    const subject = `Almost There! Secure Your African and Asian Delights Today! 🌎
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We've noticed you've curated the perfect meal plan with
                        Nourisha but haven't crossed the finish line just yet.
                        We understand that sometimes things can get in the way,
                        but your handpicked orders of mouth-watering dishes is
                        just a click away from becoming a part of your daily
                        routine.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="10"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                        ${_order?.orderExtras?.slice(0,3).map((ord) => {
                          return `                          
                          <td
                            class="stack-column"
                            style="
                              background-color: white;
                              padding: 10px;
                              border-radius: 12px;
                              margin-top: 10px;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tr>
                                <td class="stack-column-center">
                                  <img
                                    src="${ord.item.image_url}"
                                    alt="food"
                                    style="
                                      margin-bottom: 12px;
                                      display: block;
                                      border-radius: 8px;
                                    "
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td class="stack-column">
                                  <p
                                    style="
                                      color: #030517;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 800;
                                    "
                                  >
                                    £${ord.item.price.amount}.00
                                  </p>
                                  <p
                                    style="
                                      margin-bottom: 0;
                                      font-size: 18px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${ord.item.name}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>

                        `;
                      }).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Imagine not having to worry about what's for lunch or
                        dinner for the next week or even the whole month. With
                        Nourisha, you get to savour the rich flavours of home
                        with our African, Asian and European cuisines, all
                        without the hassle of daily decision-making.
                      </p>
                      <p>
                        By completing your meal plan, you're signing up for
                        convenience, variety, and a culinary journey that
                        delivers right to your doorstep. Don't let your selected
                        meals miss their chance to brighten your days.
                      </p>
                      <p>
                        Click below to secure your order and let the feasting
                        begin:
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td
                      align="center"
                      style="display: block; margin-bottom: 32px"
                    >
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Complete Your Order
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column">
                      <p>
                        Need assistance or have questions? Our WhatsApp support
                        channel is always available. Plus, as a valued
                        NourishedFoodie, you'll enjoy:
                      </p>
                      <p>
                        - Free delivery to all UK cities<br />
                        - £10 rewards for every friend you refer
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fff; color: #125309"
                        aria-label="Chat on WhatsApp"
                        href="https://wa.me/4407931621298"
                        >Go to WhatsApp
                        <img
                          src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730470381/email_template/aniin6ump6an1kubm7fi.png"
                          style="
                            display: inline-block;
                            width: 24px;
                            vertical-align: middle;
                            margin-left: 4px;
                          "
                          alt=""
                        />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Don't wait any longer, [FirstName]. Your Nourisha
                        experience is just around the corner.
                      </p>
                      <p style="margin-bottom: 0">
                        Yours Deliciously, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment5(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
      const _order = await order.findById(payload.orderId).populate( [
        {path: "customer"},
        {path: "orderExtras.item"},
        {path: "orderExtras.protein"},
        {path: "orderExtras.swallow"},
 
      ]).lean<Order>().exec()

    const subject = `Your Time Is Precious- Let Us Handle Lunch & Dinner For You!
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        Life can sometimes feel overwhelming, and taking the
                        time to prepare a rich, nutritious meal may be the last
                        thing on your mind. But worry not! Nourisha is here to
                        lighten your load and make your days more relaxing.
                      </p>
                      <p>
                        Say goodbye to meal planning, grocery shopping, and
                        slaving away in the kitchen. With Nourisha, you can have
                        gourmet African, Asian and European meals delivered
                        straight to your doorstep, guaranteeing you a
                        stress-free, delicious dining experience.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="10"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                        ${_order?.orderExtras?.slice(0,3).map((ord) => {
                          return `                          
                          <td
                            class="stack-column"
                            style="
                              background-color: white;
                              padding: 10px;
                              border-radius: 12px;
                              margin-top: 10px;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tr>
                                <td class="stack-column-center">
                                  <img
                                    src="${ord.item.image_url}"
                                    alt="food"
                                    style="
                                      margin-bottom: 12px;
                                      display: block;
                                      border-radius: 8px;
                                    "
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td class="stack-column">
                                  <p
                                    style="
                                      color: #030517;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 800;
                                    "
                                  >
                                    £${ord.item.price.amount}.00
                                  </p>
                                  <p
                                    style="
                                      margin-bottom: 0;
                                      font-size: 18px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${ord.item.name}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>

                        `;
                      }).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Imagine all the extra time you'll have to do the things
                        you genuinely enjoy. Whether it's spending quality time
                        with loved ones, pursuing your hobbies, or simply
                        indulging in a little "you time," Nourisha allows you to
                        reclaim those precious moments.
                      </p>
                      <p>
                        Don't let lunch and dinner become a chore. Let us take
                        care of it while you focus on the things that truly
                        matter. Click the button below to rediscover the joy of
                        hassle-free, mouthwatering meals!
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Rediscover Joy Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>We can't wait to simplify your meal times!</p>
                      <p>Warm regards, The Nourisha Team</p>
                      <p style="margin-bottom: 0">
                        P.S. Time is a non-renewable resource. Let us help you reclaim it!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment6(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
      const _order = await order.findById(payload.orderId).populate( [
        {path: "customer"},
        {path: "orderExtras.item"},
        {path: "orderExtras.protein"},
        {path: "orderExtras.swallow"},
 
      ]).lean<Order>().exec()

    const subject = `Spice Up Your Food Game With Nourisha
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We wanted to check in and see if anything is holding you
                        back from enjoying the Nourisha experience. Is it the
                        pricing?
                      </p>
                      <p>
                        We understand you want to get the best value for your
                        money while treating your taste buds to something
                        extraordinary. That's why we're excited to offer you a
                        limited-time discount on your first order or meal plan.
                        Use the promo code SIGNUPSAVE5 at checkout to enjoy 5%
                        off your first meal!. With this offer, you can savour
                        our African, Asian and European meals at an even more
                        affordable price.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="10"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                        ${_order?.orderExtras?.slice(0,3).map((ord) => {
                          return `                          
                          <td
                            class="stack-column"
                            style="
                              background-color: white;
                              padding: 10px;
                              border-radius: 12px;
                              margin-top: 10px;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tr>
                                <td class="stack-column-center">
                                  <img
                                    src="${ord.item.image_url}"
                                    alt="food"
                                    style="
                                      margin-bottom: 12px;
                                      display: block;
                                      border-radius: 8px;
                                    "
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td class="stack-column">
                                  <p
                                    style="
                                      color: #030517;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 800;
                                    "
                                  >
                                    £${ord.item.price.amount}.00
                                  </p>
                                  <p
                                    style="
                                      margin-bottom: 0;
                                      font-size: 18px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${ord.item.name}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>

                        `;
                      }).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Not only will you be experiencing sensational flavours,
                        but you'll also be saving time and effort in the
                        kitchen. Just heat, indulge and relax. It's that easy!
                      </p>
                      <p>
                        Click the button below to apply your discount and give
                        Nourisha a try. We promise that once you take that first
                        bite, you'll wonder how you ever lived without us.
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Claim Your Discount Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p style="margin-bottom: 0">
                        Yours Deliciously <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment7(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Hungry For More? Earn Rewards As You Order!
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
        background-image: url("https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb");
        background-repeat: no-repeat;
        background-position: 0 270px;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        We've got a special treat just for you. As a loyal
                        customer, we'd like to offer you exciting rewards on
                        your 5th, 10th, 15th, 20th meal plans!
                      </p>
                      <p>
                        Imagine not only savouring the sumptuous tastes of
                        African, Asian and European meals but also getting
                        rewarded at no additional cost! It's like having the
                        best of both worlds—convenience and the finest culinary
                        experience.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="
                        max-width: 700px;
                        width: 100%;
                        display: block;
                        text-align: center;
                        margin: auto;
                      "
                    >
                      <h2 style="font-size: 40px; margin-bottom: 30px">
                        Simply order 4 meal boxes and get 99% off your 5th meal box.
                      </h2>
                      <p>
                        Click the button below to start browsing our menu and create your next delicious Nourisha experience!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Claim Your Discount Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Stay nourished and satisfied! <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment8(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus.first_name}, Explore Intercontinental Dishes Nourisha!
  
  `;
  const body = 
`
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .green-section {
        background-color: #28640a;
        color: #ffffff;
      }

      .yellow-section {
        background-color: #def54c;
        color: #000;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td style="background-color: #ffffff">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/pa88wayo43zai6cxworw"
                  alt="Welcome to Nourisha"
                  style="width: 100%"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <p>Hey there ${cus.first_name}!</p>
                <p>
                  Ever dreamt of travelling across Africa, Asia and Europe? and
                  savouring exotic dishes from different countries? Well, buckle
                  up, because we are taking your taste buds on an appetising
                  adventure!
                </p>
                <p>
                  From the scintillating flavours of African, Asian and European
                  meals, our chefs bring the original tastes of the world to
                  your plate..
                </p>
              </td>
            </tr>
            <!-- Menu Section -->
            <tr>
              <td
                style="
                  background-image: url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ssqpfnzgqctysyw3q139');
                  background-repeat: no-repeat;
                  background-position: bottom right;
                "
                class="green-section content-block"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="stack-column"
                      style="height: 100%; display: block"
                    >
                      <h2>
                        Here's a sneak peek at the culinary destinations you can
                        visit:
                      </h2>
                    </td>
                    <td class="stack-column">
                      <h2>African:</h2>
                      <p>
                        Dive into the rich, savoury goodness of Egusi soup and
                        semo or the hearty comfort of Kenkey and okra.
                      </p>
                      <h2>Asian:</h2>
                      <p>
                        Sesame Chicken and Noodles or Spicy Korean Chicken and
                        Jasmine Rice.
                      </p>
                      <p>We guarantee your taste buds will thank you!</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="
                        max-width: 700px;
                        width: 100%;
                        display: block;
                        text-align: center;
                        margin: auto;
                      "
                    >
                      <p>
                        Ready to experience African, Asian or European's
                        treasures?
                      </p>
                      <h2 style="font-size: 40px; margin-bottom: 30px">
                        Taste the richness of diverse cuisines.
                      </h2>
                      <p>Don't be left behind!</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Deliciously Yours, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:07867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment9(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus.first_name}, Here Is An Update On Your Upcoming Trip
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #fff;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        Remember that incredible food journey we told you about?
                        Well, we're here to remind you that your taste buds are
                        missing out on the adventure of a lifetime!
                      </p>
                      <p>
                        Did you know you can savour the moist goodness of Egusi
                        soup and semo or indulge in the hearty comfort of Kenkey
                        and okra from Nigeria and Ghana? And how about trying
                        the succulent combination of Sadza and Roadrunner from
                        Zimbabwe, Hyderabadi Lamb Biryani and Raita from India
                        or Beef Meatball Marinara and Spaghetti from Italy,
                        without booking a trip to any of these countries or a
                        pricey restaurant?
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column" align="center">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286481/email_template/ba69plak8larckfnmdbd.png"
                        alt=""
                      />
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>Trust us, your taste buds will thank you!</p>
                      <p>
                        But wait, there's more! We want to make your food
                        adventure even sweeter. Use the code <b>LOYALTYREWARD</b> to
                        enjoy 99% off your meal plans after your 5th, 10th, 15th
                        and 20th meal plans! It's our way of saying thank you
                        for joining us on this delectable adventure. So,
                        FirstName, are you ready to ignite your taste buds and
                        explore the delightful treasures? Join us today!
                      </p>
                      <p>
                        So, FirstName, are you ready to ignite your taste buds
                        and explore the delightful treasures? Join us today!
                      </p>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Start Exploring
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p style="margin-bottom: 0">
                        Tantalisingly Yours, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block yellow-section"
                style="text-align: center"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment10(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus.first_name}, Your Table Is Set, and The Flavours Awaits....✨ 
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .white-section {
        background-color: #fff;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block white-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We've noticed that some of our finest meals have been
                        sitting in your cart, and we can't help but think
                        they're getting lonely. Our chefs have put their heart
                        into preparing these dishes, and they can't wait to see
                        you enjoy them.
                      </p>
                      <p>
                        We're wondering, have we been a bit too eager? If our
                        reminders felt overwhelming, we're here to dial it back.
                        Your comfort is our priority, and we're ready to give
                        you the space you need.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-block cream-section" align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="stack-column-center"
                      style="display: block; text-align: center"
                    >
                      <p>
                        Before we take a step back, here's a little something:
                        Unlock 99% off your 5th order as part of our Loyalty
                        Reward. Your bonus will be applied automatically!
                      </p>
                      <h1
                        style="
                          max-width: 646px;
                          margin-left: auto;
                          margin-right: auto;
                        "
                      >
                        Get 99% Off on Us - Finish Your Order Today!
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Complete Your Order
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-block white-section">
                <p>
                  No rush, though. We'll also send you occasional emails with
                  discount offers and other exciting goodies. Whenever you're
                  ready, we'll be here to deliver convenience, taste, and the
                  joy of Intercontinental cuisines right to your doorstep.
                </p>
                <p>Until then, take care and eat well!</p>
                <p>
                  Cheerfully yours, <br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center yellow-section"
                align="center"
              >
                <h2 style="color: #000">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block yellow-section"
                style="text-align: center"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function cartAbandonment11(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Savour The Savings: Complete Your Nourisha Feast Today! 
  
  `;
  const body = 
  `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Cart Abandonment</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .white-section {
        background-color: #fff;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block white-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        It's been a while since we last chatted, and we've
                        noticed you have some delectable choices waiting in your
                        cart. It seems our delightful African, Asian and
                        European meals are eager to meet you, and we're just as
                        excited to bring them to your table.
                      </p>
                      <p>
                        Perhaps we've been a little too enthusiastic with our
                        reminders? We're all about making sure you have the best
                        experience without any pressure. So, we're going to take
                        a little break and let you decide when you're ready.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-block cream-section" align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="stack-column-center"
                      style="display: block; text-align: center"
                      align="center"
                    >
                      <p>
                        And because we can't help but spoil you, here's an
                        offer: Unlock 99% off your 5th order as part of our
                        Loyalty Reward.
                      </p>
                      <h1
                        style="
                          max-width: 646px;
                          margin-left: auto;
                          margin-right: auto;
                        "
                      >
                        Order 4 times in 30 days and get 99% off your 5th box.
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Complete Your Order
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-block white-section">
                <p>
                  Take your time, and when you're set, we'll be here with open
                  arms and flavours that thrill. In the meantime, we'll send you
                  occasional emails with discount offers and other exciting
                  goodies. Your journey to culinary bliss is just a click away.
                </p>
                <p>
                  Wishing you all the best, <br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center yellow-section"
                align="center"
              >
                <h2 style="color: #000">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block yellow-section"
                style="text-align: center"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub1(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Welcome to the stress-free side of life 🎉 `;
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .mini-white-section {
        background-color: #fff;
        color: #000;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .white-section {
        background-color: #fff;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #125309;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block white-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        Welcome to the Nourisha family where we ease off your
                        stress and help you live like the boss you are. We're
                        thrilled to be a part of your journey towards healthier
                        eating habits and a more nourished life.
                      </p>
                      <p>
                        As a valued NourishedFoodie, you can now access
                        delicious, nutrient-rich African, Asian and European
                        meals made with fresh ingredients by our experienced
                        chefs and delivered straight to your doorstep.
                      </p>
                      <p>
                        You no longer have to worry about what to eat, or eating
                        unhealthy junk food because you don’t have the time to
                        go grocery shopping or cook a great meal. From now on,
                        we’ve got you covered.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
                align="center"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column-center" style="display: block">
                      <p>
                        <strong
                          >Here are a few tips to help you make the most of your
                          Nourisha experience:</strong
                        >
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="border-collapse: separate; border-spacing: 8px"
                      >
                        <tr>
                          <td class="stack-column mini-white-section">
                            <h3>Customise Your Meals</h3>
                            <p style="margin: 0">
                              Log into your account, select African or Asian
                              meal type and choose your preferred meal plan,
                              dietary preferences and allergies (if any).
                            </p>
                          </td>
                          <td class="stack-column mini-white-section">
                            <h3>Plan Ahead</h3>
                            <p style="margin: 0">
                              Take advantage of our monthly meal plans to
                              schedule your deliveries in advance. This way,
                              you'll never run out of delectable options to look
                              forward to.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="stack-column mini-white-section">
                            <h3>Earn Rewards</h3>
                            <p style="margin: 0">
                              Don't forget to refer your friends and family to
                              Nourisha! For every successful referral, you'll
                              receive a £10 credit towards your next order or
                              you can choose to cash out all your referral
                              bonuses.
                            </p>
                          </td>
                          <td class="stack-column mini-white-section">
                            <h3>Stay connected</h3>
                            <p style="margin: 0">
                              Follow us on social media for nutrition tips, and
                              exclusive NourishedFoodie offers.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="display: block; margin-top: 20px"
                    >
                      <p>
                        We're here to make your life more convenient,
                        affordable, and accessible to the flavours of home - no
                        matter where you are in the UK. If you have any
                        questions or concerns, our dedicated support team is
                        just a click away.
                      </p>
                      <p>
                        Here's to a future filled with nourishing meals and a
                        vibrant, healthy lifestyle!
                      </p>
                      <p>
                        Yours Deliciously, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- App Download Section -->
            <tr>
              <td class="content-block mobile-text-center" align="center">
                <h2 style="color: #000">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="content-block" style="text-align: center">
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub2(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Hope You Enjoyed Your First Taste, ${cus?.first_name}! Ready For More? 🍽️`;
  
    const body = 
    `
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We hope you loved your first taste of Nourisha's
                        chef-crafted meals! It's our mission to bring a burst of
                        flavor and a world of convenience to your table.
                      </p>
                      <p>
                        If you're already thinking about the next dish, we've
                        got you covered! With our flexible meal plans, you can
                        keep enjoying delicious Afro-Asian and Intercontinental
                        flavors every week or month—no planning or prepping
                        needed.🧡
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/f3fy7hgn8dv0a9na7qas"
                        width="100%"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        At Nourisha, we understand the hassle of market runs,
                        meal planning, and prep, and we want to help you avoid
                        reverting to unhealthy eating habits. Yikes! If now's
                        not the right time to order again, no worries! You have
                        full control, and whenever you're ready, you can easily
                        return to the app and get back to enjoying your meals.
                      </p>
                    </td>
                  </tr>
                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Now!
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p style="margin-bottom: 0">
                        Yours Deliciously <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content-block" style="background-color: #fff">
                <p>
                  And as a special thank you, if you order your meal plan up to
                  4 times in this month, you'll get a 99% discount off your next
                  order for being such an awesome Nourished Foodie!
                </p>
                <p>
                  If you have any questions, our customer support team is just a
                  <a href="https://wa.me/4407931621298">WhatsApp</a> chat away,
                  ready to assist with your Nourisha needs.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #fff">
                <a
                  class="ctaButton"
                  style="background: #fff; color: #125309"
                  aria-label="Chat on WhatsApp"
                  href="https://wa.me/4407931621298"
                  >Go to WhatsApp
                </a>
              </td>
            </tr>
            <tr>
              <td class="content-block" style="background-color: #fff">
                <p>Cheers to many more delicious meals together!</p>
                <p>
                  Yours Deliciously, <br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `
  ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub3(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `First Taste Down, Many More To Go! Ready For Round 2? `;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name}!</strong></p>
                      <p>
                        We hope your first Nourisha meal brought you joy and
                        flavor! Your taste buds just got a glimpse of what's to
                        come, and we're thrilled to be part of your food
                        journey.
                      </p>
                      <p>
                        What's next? Dive deeper into our world of Afro-Asian
                        and Intercontinental dishes with one of our flexible
                        meal plans! Imagine savoring your favorites weekly or
                        monthly, without ever lifting a finger in the kitchen.
                      </p>
                      <p>
                        Discover your perfect meal plan match! Click the button
                        below to explore our delicious options and keep the
                        flavorful, intercontinental cuisine coming.
                      </p>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="
                          margin-bottom: 32px;
                          background: #def54c;
                          color: #000;
                          display: inline-block;
                        "
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Explore Our Meal Plans Now
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/f3fy7hgn8dv0a9na7qas"
                        width="100%"
                      />
                    </td>
                  </tr>

                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        If you have any questions or need assistance, our
                        friendly customer support team is just a WhatsApp chat
                        away, ready to help you with all your Nourisha needs.
                      </p>
                      <p>
                        Don't let those cravings go unsatisfied, ${cus.first_name}!
                        Order today and continue your delicious journey with us
                        as your personal chef.
                      </p>
                      <p>
                        Cheers to many more flavorful adventures, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub4(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Lost Your Way in the Food Jungle?🌿 Let's Get You Back!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      li,
      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block" style="background-color: #fff">
                <p><strong>Dear ${cus.first_name},</strong></p>
                <p>
                  We've been missing your presence at our table! It's been a
                  while since we last delivered a box of foodie love to your
                  doorstep. Life's daily hustle can sometimes lead us astray
                  from the joys of a well-nourished life. But not to worry,
                  Nourisha is here to guide you back to the scrumptious African,
                  Asian and European flavours that you love.
                </p>
              </td>
            </tr>
            <tr>
              <td
                class="content-block cream-section"
                style="
                  background: #f9f3e4
                    url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/nf9lvzxabbblfyntq0ul')
                    no-repeat bottom right;
                "
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>
                        <strong
                          >Here's a little nudge to help you rediscover the
                          yummy delights of Nourisha:</strong
                        >
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="border-collapse: separate; border-spacing: 8px"
                >
                  <tr>
                    <td class="stack-column black-section">
                      <h3>Pocket-Friendly Gourmet Adventure</h3>
                      <p>
                        Dive into dishes that sing with flavour, crafted by our
                        chefs with the freshest ingredients. Your wallet will
                        thank you too!
                      </p>
                    </td>
                    <td class="stack-column black-section">
                      <h3>Time-Saving Delights</h3>
                      <p>
                        Bypass the meal prep and dive straight into savouring.
                        We're all about giving you back those precious moments.
                      </p>
                    </td>
                    <td class="stack-column black-section">
                      <h3>A Menu as Diverse as Your Cravings</h3>
                      <p>
                        Our menu is bursting with over 80 African, Asian, and
                        European delicacies from Nigeria, Zimbabwe, and Ghana
                        that are sure to keep your taste buds watering with
                        sweet cravings.
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin-top: 30px"
                >
                  <tr>
                    <td class="stack-column">
                      <p>
                        And because we believe in second chances, here's a
                        welcome-back gift just for you: Enjoy 99% off your 5th
                        order. This is our way of saying, "We can't wait to have
                        you back!"
                      </p>
                      <p>
                        Reignite your love for effortless, delicious meals with
                        Nourisha. Click here to start your journey again!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Reignite Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p style="margin-bottom: 0">
                        With flavour and fervour, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub5(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `A Round Of Applause For Your Excellent Taste, ${cus?.first_name} 👏🏾`;
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        you're a real one for sticking with us! We're doing a
                        little happy dance over here to celebrate your excellent
                        taste (literally!).
                      </p>
                      <p>
                        Our mouth watering intercontinental meals are worth of
                        delicious feast that'll have your taste buds thanking
                        you for your excellent taste. 
                      </p>
                      <p>
                        But enough jabbering from us. The real star of the show
                        can arrive on your doorstep, hot and fresh out the
                        kitchen if you just Order Now
                      </p>
                      <a
                        class="ctaButton"
                        style="margin-top: 32px; margin-bottom: 32px; background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Now
                      </a>
                      <p>
                        We'll be serving up pure deliciousness, one bite at a
                        time. Buckle up and get ready to feast like royalty!
                      </p>
                      <p>
                        Cheers to many more flavorful adventures, <br />
                        Your Pals at Nourisha
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
  
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub6(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus?.first_name}, Turn Your Human Connection into Cash`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>
            <tr>
              <td align="center" class="black-section" style="padding: 16px">
                <h2 style="margin: 0">Earn Up to £300 with Nourisha!🤑</h2>
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>
                        Calm down ${cus.first_name}, it is not what you are thinking.
                        The way you rushed to open this email ehn! Ah ahn!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column" width="60%">
                      <img
                        src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/d4q8gtl79koxjb3npubn"
                        alt=""
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block stack-column"
                style="background-color: #fff"
              >
                <p>
                  On a serious note, let's reveal a secret that will empower you
                  to make up to £300 in only 2 steps.
                </p>
                <p>
                  <b>Step 1:</b> Share your unique referral code with friends,
                  family, and colleagues - and earn £10 for every successful
                  referral!
                </p>

                <h3 style="color: #125309">Imagine this:</h3>
                <p>
                  You have 20 colleagues and 10 busy friends who crave
                  home-cooked meals but lack the time to cook. You share your
                  referral code, and they download the Nourisha app, sign up for
                  free, and upgrade to a meal plan. <br />Just like that, you've
                  earned £300! <br />
                  And it gets better!
                </p>

                <p>
                  <b>Step 2:</b>Expand your reach through your WhatsApp groups
                  and social media. Spread the word about Nourisha's delicious
                  chef-cooked meals and get the money rolling in
                </p>

                <p><b>Here's how to find your unique referral code:</b></p>
                <ul style="margin: 0 0 0 40px">
                  <li>Login to your Nourisha account.</li>
                  <li>
                    Navigate to “account” and click the "Referrals" menu to
                    reveal your unique code.
                  </li>
                  <li>
                    Copy your unique referral code and share it with your
                    friends and family!
                  </li>
                </ul>
                <p>
                  Don't worry about sales pitches! Our social media is packed
                  with amazing content - user reviews, mouthwatering photos, and
                  more - share them and let the food do the talking!
                </p>

                <p>Are you ready to start earning extra cash? ⏰</p>
                <p>Start sharing your referral code today!</p>

                <p style="margin-bottom: 0">
                  With Foodie Love, <br />
                  The Nourisha Team
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #fff">
                <a
                  class="ctaButton"
                  style="margin: 10px; background: #def54c; color: #000"
                  aria-label="Claim Welcome Discount Now"
                  href="#"
                  >Start Earning
                </a>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub7(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Subject: Share the Nourisha love! Get £10 off every Referral`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #125309;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>
            <tr>
              <td align="center" class="black-section" style="padding: 16px">
                <h2 style="margin: 0">Get £10 off every Referral</h2>
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><b>Dear ${cus.first_name},</b></p>
                      <p>
                        Love your Nourisha meals? Share the deliciousness with
                        your friends and earn rewards! <br /> Refer a friend and get
                        £10 credited to you!
                      </p>

                      <h3>Its simple!!!</h3>
                      <p>
                        Click “Refer a friend” in the home section of the app to
                        generate your unique referral link. <br />
                        Share your link with your friends and family. <br />
                        When they sign up for a Nourisha meal plan using your
                        link, you get £10 credited to you!
                      </p>

                      <p style="margin-bottom: 10px">
                        <b>Spread the Nourisha love:</b>
                      </p>
                      <ul style="margin: 0 0 20px 40px">
                        <li>Share your referral link on social media.</li>
                        <li>Email it to your friends and family.</li>
                        <li>
                          Tell them about your fantastic Nourisha experience!
                        </li>
                      </ul>

                      <p>The more you share, the more you earn!</p>
                      <p>
                        There's no limit to the number of friends you can refer,
                        so start sharing and enjoy delicious meals from us with
                        your earnings.
                      </p>

                      <p>
                        Happy referring! <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub8(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus?.first_name}, Make extra Quis with Nourisha!🎉`;
  
    const body = 
    `
    ${cus.first_name}
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function postsub9(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Uncover Hidden Gems ${cus?.first_name}: New Asian & African flavors!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Post Order</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #125309;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>
            <tr>
              <td align="center" class="black-section" style="padding: 16px">
                <h2 style="margin: 0">Make extra Quids with Nourisha! 🎉</h2>
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><b>Dear ${cus.first_name},</b></p>
                      <p>
                        The weekend's calling, and it's time for joy, jokes, and
                        juicy meals with your nearest and dearest. But guess
                        what? You could be having fun and making money at the
                        same time! Here's how:
                      </p>
                      <p>
                        Introducing our Referral program, where your invites
                        mean ours and your delight. For every friend who joins
                        the Nourisha tribe on your recommendation, you pocket a
                        tasty £10. Now, that's what we call a flavour-filled
                        friendship!
                      </p>

                      <h3 style="margin-bottom: 10px">
                        Ready to spread the taste? Here's how:
                      </h3>
                      <ul style="margin: 0 0 20px 40px">
                        <li>Log into your Nourisha account.</li>
                        <li>
                          Head over to the “Account” section and tap on
                          "Referrals".
                        </li>
                        <li>
                          Unveil your unique referral code and pass it on to
                          your pals.
                        </li>
                      </ul>

                      <h3 style="margin-bottom: 10px">
                        And for your friends, it's as simple as:
                      </h3>
                      <ul style="margin: 0 0 20px 40px">
                        <li>Downloading the Nourisha app.</li>
                        <li>Signing up and dropping in your referral code.</li>
                        <li>
                          Choosing a meal plan or ordering single meals worth
                          £100.
                        </li>
                      </ul>

                      <p>
                        Then, just like magic, £10 is all yours, and the feast
                        begins!
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="margin: 10px; background: #def54c; color: #000"
                        aria-label=""
                        href="#"
                        >Invite Your Friends
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Let's make this weekend a festival of fun, flavour and
                        money making. Share the Nourisha love!
                      </p>
                      <p>
                        Generously yours, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  
  export async function Reengage1(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `It's Been a While ${cus?.first_name}! You're Missing Out on Fresh Flavors`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Re-engagement</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
        background-image: url("https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb");
        background-repeat: no-repeat;
        background-position: 0 385px;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        It's been a while since we last heard from you, and
                        we're delighted to reconnect! We couldn't help but
                        notice that you've been dipping out on the mouth
                        watering flavours that we offer to VIPs like you. But
                        fear not, we're here to entice you back into the fold
                        with a sprinkle of something special. 😊 Let's just say,
                        your next 5th order will be more than just a free meal
                        box. We've been cooking up a little surprise,
                        exclusively for our VIPs, and trust us—you don't want to
                        miss this one. Curious yet? You'll have to see for
                        yourself…
                      </p>
                      <p>
                        Imagine coming home after a crazy day to find a
                        sumptuous African, Asian and European meal waiting for
                        you, ready to be devoured. Wouldn't that be wonderful?
                        And let's not forget about the delightful
                        Intercontinental meals that are just a few clicks away.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="
                        max-width: 700px;
                        width: 100%;
                        display: block;
                        text-align: center;
                        margin: auto;
                      "
                    >
                      <p>
                        We've been busy in the kitchen! Our chefs have added
                        some exciting new meals to our menu that we think you'll
                        love.
                      </p>
                      <h2 style="font-size: 40px; margin-bottom: 30px">
                        Exciting New Meals, Crafted for You! 🍽️
                      </h2>
                      <p>
                        Dont keep your taste buds waiting, mouthwatering meals
                        await! Click the button to rediscover the joys of
                        Nourisha! 🍲
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Stay nourished and satisfied! <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p style="margin-bottom: 0">
                  With flavorful anticipation, <br />
                  The Nourisha Team 🧡
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function Reengage2(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `We Miss You, ${cus?.first_name}!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Re-engagement</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
        background-image: url("https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb");
        background-repeat: no-repeat;
        background-position: 0 245px;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        The table is set, and we can't wait to reunite you with
                        the simmering goodness of party Jollof, the satisfying
                        deliciousness of Waakye, or the burst of flavors that
                        Cajun Garlic Chicken and Spaghetti release with each
                        bite.
                      </p>
                      <p>
                        Experience the joy of the finest intercontinental
                        delicacies delivered straight to your doorstep.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="
                        max-width: 700px;
                        width: 100%;
                        display: block;
                        text-align: center;
                        margin: auto;
                      "
                    >
                      <p>
                        Lets rekindle your love for convenience, affordability,
                        and, most importantly, delicious meals. Were here to
                        make every bite a celebration! Click the button below to
                        rediscover your favourite flavours.
                      </p>
                      <h2 style="font-size: 40px; margin-bottom: 30px">
                        The Nourisha Meals Everyone's Raving About!
                      </h2>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p>Let's make your mealtime extraordinary again! 🌟</p>
                      <p>
                        Excitedly, <br />
                        The Nourisha Team 🌟
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p style="margin-bottom: 0">
                  With flavorful anticipation, <br />
                  The Nourisha Team 🧡
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function Reengage3(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Is Your Taste Adventure on Pause? Don't Miss Out on Earning Exclusive Rewards!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Re-engagement</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .black-section {
            background-color: #000;
            color: white;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
            background-image: url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb');
            background-repeat: no-repeat;
            background-position: 0 300px
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #DEF54C;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <!-- Header Section -->
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block cream-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hey there ${cus.first_name}!</strong></p>
                                        <p>It’s been a while since we had the pleasure of delivering Nourisha’s delicious intercontinental meals to your doorstep. Our chef-crafted dishes have missed gracing your table, and we’re here to reignite your taste adventure with flavors that make dining effortless and exciting.
                                        </p>
                                        <p>Feeling like you’re missing out? Your next meal is just an order away, ready to take you on a global culinary journey! And remember, when you refer friends or family, you earn £10 off each referral. Plus, with a little luck, they might even share their meals with you—making it a win-win!</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="content-block yellow-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" class="stack-column-center"
                                        style="max-width: 700px; width: 100%; display: block; text-align: center; margin: auto;">
                                        <p><strong>We can't wait to cook for you again!</strong></p>
                                        <p>Are you ready to get back on track with your nutritious meals?</p>
                                        <h2 style="font-size: 40px; margin-bottom: 30px;">We Miss You!
                                            Nourisha's Fresh Meals Await</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a class="ctaButton" style="background: #FE7E00; color: #fff;"
                                            aria-label="Claim Welcome Discount Now" href="#">Claim your discount
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="stack-column-center"
                                        style="margin-top: 32px; display: block;">
                                        <p>Remember, every meal with Nourisha is a masterpiece carefully crafted by our
                                            chefs for your enjoyment. So why wait?
                                            Order now and let's get back to savouring the flavour of the UK together!
                                        </p>
                                        <p>Deliciously Yours, <br>
                                            The Nourisha Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="content-block" style="background-color: #fff; padding-bottom: 0;">
                            <p style="margin-bottom: 0;">With flavorful anticipation, <br>
                                The Nourisha Team 🧡</p>
                        </td>
                    </tr>

                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center" style="background-color: #fff;">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center; background-color: #fff;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function Reengage4(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Your Taste Buds Miss Us! Rediscover Nourisha Today!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Re-engagement</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
        background-image: url("https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb");
        background-repeat: no-repeat;
        background-position: 0 325px;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        It's been a while since your last foodie adventure with
                        Nourisha, and we're curious, are your taste buds missing
                        the delight of our chef-cooked meals? Eating well is key
                        to maintaining a healthy lifestyle, and our kitchen has
                        been bustling with your all-time favourites, crafted to
                        nourish both your body and soul. Let us bring excitement
                        back to your plate while boosting your well-being!
                      </p>
                      <p>
                        Life is long enough for you to nourish your body with
                        what it needs. Our aim is to provide options that offer
                        you the freedom to choose exactly what you want, when
                        you want it, no strings attached, just pure, delectable
                        convenience.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="
                        max-width: 700px;
                        width: 100%;
                        display: block;
                        text-align: center;
                        margin: auto;
                      "
                    >
                      <p><strong>A Gift for Your Tastebuds:</strong></p>
                      <p>
                        Apply Coupon code GIFT and reignite your love for
                        Nourisha's flavours.
                      </p>
                      <h2 style="font-size: 40px; margin-bottom: 30px">
                        Our Chef's Latest Creations Await You!
                      </h2>
                      <p>
                        Don't keep your taste buds waiting, mouthwatering meals
                        await! Click the button to rediscover the joys of
                        Nourisha! 🍲
                      </p>
                      <p>
                        Ready to give up the kitchen struggles and live your
                        best life? Subscribe to a meal plan now.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fe7e00; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Yummy Meals Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Place your order and let's make your mealtime a
                        highlight of your day once again.
                      </p>
                      <p>
                        Tastily Yours, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p style="margin-bottom: 0">
                  With flavorful anticipation, <br />
                  The Nourisha Team 🧡
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function Reengage5(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Free Side Dish....Ready to Dig In?`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Re-engagement</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        Is your palate ready for a little excitement? We've been
                        cooking up a delicious storm and noticed you haven't had
                        a taste of the action lately. Your Nourisha app is
                        brimming with Intercontinental meals that will satisfy
                        your craving for momma's cooking!
                      </p>
                      <p>
                        Why not take a trip to to the world from the comfort of
                        your home? With just a few taps, you can embark on a
                        yummy journey that brings the zest of African, Asian and
                        European cuisine right to your doorstep. It's delicious
                        convenience at its finest!
                      </p>
                      <p>
                        And because we love to spice things up, here's an
                        exciting treat to elevate your next meal: Enjoy an
                        exclusive chef's selection added to your order! But act
                        fast, this special addition is as fleeting as the last
                        sip of a delicious drink!
                      </p>
                      <p>So, what are you waiting for?</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #def54c; color: #000"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Order Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p style="margin-bottom: 0">
                        With flavorful anticipation, <br />
                        The Nourisha Team 🧡
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function Reengage6(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Where have You Been ${cus?.first_name}? Your Favorite Meals Are Wating!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Re-engagement</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
        background-image: url("https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb");
        background-repeat: no-repeat;
        background-position: 0 325px;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 14px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        /* .cream-section {
                background-position: 0 385px !important;
            } */

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hey there ${cus.first_name}!</strong></p>
                      <p>
                        You have not logged into your account to explore more
                        delicious intercontinental meals lately, and your taste
                        buds are definitely missing out! Remember those amazing
                        meals you used to order?
                      </p>
                      <p>
                        Well, there are so many other African, Asian and
                        European dishes on our menu you are yet to try. It's
                        like a whole new yummy adventure waiting for you!
                      </p>
                      <p>
                        Order a meal you are yet to try with just a few taps,
                        and get your food delivered straight to your door. Enjoy
                        a taste of Africa, Asian or European world without
                        leaving your home today.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="
                        max-width: 700px;
                        width: 100%;
                        display: block;
                        text-align: center;
                        margin: auto;
                      "
                    >
                      <p>
                        <strong
                          >Ready to rekindle your love for intercontinental
                          cuisine?</strong
                        >
                      </p>
                      <h2 style="font-size: 40px; margin-bottom: 30px">
                        Be the First to Try Our New Dishes! 🍛
                      </h2>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fe7e00; color: #fff"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Log in to your account
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      class="stack-column-center"
                      style="margin-top: 32px; display: block"
                    >
                      <p>
                        Don't wait too long, this offer disappears faster than a
                        plate of Jollof Rice!
                      </p>
                      <p>
                        Deliciously Yours, <br />
                        Your Pals at Nourisha
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block"
                style="background-color: #fff; padding-bottom: 0"
              >
                <p style="margin-bottom: 0">
                  With flavorful anticipation, <br />
                  The Nourisha Team 🧡
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };

  export async function customerRetention1(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Welcome to the Nourisha Rewards Club`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Customer Retention</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .black-section {
            background-color: #000;
            color: white;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #28640A;
        }

        .ctaButton {
            display: inline-block;
            margin-top: 32px;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #DEF54C;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 16px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <!-- Header Section -->
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" class="black-section" style="padding: 16px;">
                            <h2 style="margin-bottom: 0;">Level Up Your Foodie Game!</h2>
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block cream-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello there, ${cus.first_name},</strong></p>
                                        <p>Get ready to unlock delicious rewards and give your taste buds a treat with
                                            the all-new Nourisha Rewards Club!<br>
                                            As a member of the Nourisha Rewards Club, you get to earn stars with every
                                            5th, 10th, 15th purchase. You unlock badges,
                                            exclusive perks, and even the chance to win a £100 Gift Card!
                                        </p>
                                        <h3 style="margin-bottom: 10px; color: #125309;"><b>Here's how it works:</b>
                                        </h3>
                                        <ul style="margin: 0 0 20px 40px;">
                                            <li><b>Order your favourite meals:</b> Every purchase earns you a star</li>
                                            <li><b>Climb the ranks:</b> Earn badges and move up different tiers (Novice,
                                                OG, upgraded - Ambassador) for even more rewards!
                                            </li>
                                            <li><b>Unlock exclusive perks:</b> Get early access to new menus, free
                                                gifts, and special discounts depending on your tier.</li>
                                            <li><b>Win a £100 Gift Card:</b> Reach Ambassador Star point and stand the
                                                chance to win!</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="display: block; margin-top: 32px;">
                            <p>Ready to embark on your delicious quest?</p>
                            <p style="margin-bottom: 0;">Just download the Nourisha app or visit our website to order
                                tasty African meals or
                                subscribe to a meal plan to start
                                earning points today!</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            
                            <a class="ctaButton" style="background: #FE7E00; color: black;" aria-label=""
                                href="https://www.eatnourisha.com">Visit website
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td class="stack-column" style="margin-top: 32px; display: block;" width="60%">
                            <p>See you on the leaderboard, <br>
                                The Nourisha Team</p>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center" style="background-color: #fff;">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center; background-color: #fff;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function customerRetention2(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Become a Nourisha Trailblazer: Exclusive Rewards Await!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Customer Retention</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .black-section {
            background-color: #000;
            color: white;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #28640A;
        }

        .ctaButton {
            display: inline-block;
            margin-top: 32px;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #DEF54C;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 16px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <!-- Header Section -->
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" class="black-section" style="padding: 16px;">
                            <h2 style="margin-bottom: 0;">Can you handle the heat?</h2>
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block cream-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello there, ${cus.first_name},</strong></p>
                                        <p>Nourisha is spicing things up with our rewards program, and you don't want to
                                            miss out!
                                        </p>
                                        <h3 style="margin-bottom: 10px; color: #125309;"><b>Here's why you'll love
                                                it:</b>
                                        </h3>
                                        <ul style="margin: 0 0 20px 40px;">
                                            <li>Earn stars with every purchase.</li>
                                            <li>Unlock star badges and climb the ranks to become a Nourisha Ambassador.
                                            </li>
                                            <li>Enjoy exclusive perks like early access to new dishes, free delivery
                                                offers, and special discounts!</li>
                                            <li>Plus, the higher your tier, the more points you earn!</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="display: block; margin-top: 32px;">
                            <p style="margin-bottom: 0;">Are you a meal plan user who spends between £280-£320 monthly?
                                You're already on your way to becoming a Culinary
                                Legend!</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a class="ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                href="#">Download app
                            </a>
                            <a class="ctaButton" style="background: #FE7E00; color: black;" aria-label=""
                                href="https://www.eatnourisha.com">Visit website
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td class="stack-column" style="margin-top: 32px; display: block;" width="60%">
                            <p>Climb the Nourisha Loyalty Ladder by downloading our app or visiting our website to
                                discover your current tier and
                                unlock a world of delicious rewards!</p>
                            <p>Happy Eating, <br>
                                The Nourisha Team</p>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center" style="background-color: #fff;">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center; background-color: #fff;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function customerRetention3(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Win a £100 Nourisha Gift Card!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Customer Retention</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .black-section {
            background-color: #000;
            color: white;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #28640A;
        }

        .ctaButton {
            display: inline-block;
            margin-top: 32px;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #DEF54C;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 16px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <!-- Header Section -->
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <tr>
                        <td align="center" class="black-section" style="padding: 16px;">
                            <h2 style="margin-bottom: 0;">Can you handle the heat?</h2>
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block cream-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello there, ${cus.first_name},</strong></p>
                                        <p>We're excited to introduce an amazing opportunity for you to win a £100 Gift
                                            Card or gift someone special with our
                                            scrumptious Intercontinental meals!
                                        <h3 style="margin-bottom: 10px; color: #125309;"><b>How it works:
                                                it:</b>
                                        </h3>
                                        <ul style="margin: 0 0 20px 40px;">
                                            <li><b>Earn Star Points:</b> Every purchase earns you a star</li>
                                            <li><b>Reach Ambassador Star Points:</b> Once you've accumulated all stars,
                                                you stand a chance to win a £100 Gift Card!
                                            </li>
                                            <li><b>Gift Someone Special:</b> Use your start points to surprise yourself
                                                or your loved ones with our mouth-watering meals. You can also
                                                outrightly
                                                purchase a Gift Card for your loved ones to appreciate or celebrate
                                                them!</li>
                                        </ul>
                                        <p>Ready to get started?</p>
                                        <p style="margin-bottom: 0;">Subscribe to a meal plan: Get consistent,
                                            nutritious meals and rack up those star points faster.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" class="cream-section" style="display: block; padding-bottom: 32px;">
                            <a class="ctaButton" style="background: #DEF54C; color: black; margin-right: 16px;" aria-label=""
                                href="#">Download app
                            </a>
                            <a class="ctaButton" style="background: #FE7E00; color: black;" aria-label=""
                                href="https://www.eatnourisha.com">Visit website
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="display: block; margin-top: 32px;">
                            <h3 style="color: #28640A;">Why you'll love it:</h3>
                            <p><b>Get Exclusive Perks:</b> Early access to new menus, free gifts, and special discounts as you climb the ranks.</p>
                            Don't wait! Start ordering now to earn cardinal points and get closer to winning a £100 Gift Card or gifting someone
                            special with Nourisha's delightful meals.
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a class="ctaButton" style="background: #DEF54C; color: black; margin-right: 16px;" aria-label=""
                                href="#">Order Now
                            </a>
                            <a class="ctaButton" style="background: #FE7E00; color: black;" aria-label=""
                                href="https://www.eatnourisha.com">Subscribe Now
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td class="stack-column" style="margin-top: 32px; display: block;" width="60%">
                            <p>Climb the Nourisha Loyalty Ladder by downloading our app or visiting our website to
                                discover your current tier and
                                unlock a world of delicious rewards!</p>
                            <p>Happy Eating, <br>
                                The Nourisha Team</p>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center" style="background-color: #fff;">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center; background-color: #fff;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function NoviceEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Hey Rising Star! Level Up & Earn Rewards!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Novice</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>Have we told you how thrilled we are to have you join the Nourisha family!
                                            You're officially a Rising Star✨, and that
                                            means you've earned your first badge on your exciting culinary adventure
                                            with us.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>But the journey's just beginning! Buckle up and get ready to unlock delicious
                                            rewards as you explore the vibrant
                                            flavours of Africa, Asia and Europe carefully crafted with natural
                                            ingredients by our chefs.
                                            Every meal you order, every meal plan you start, brings you closer to
                                            becoming a Nourisha legend.</p>
                                        <p>Stay tuned for more updates on how to climb the rewards ladder!</p>
                                        <p>To level up, browse our mouth watering menus and order intercontinental meals
                                            or subscribe to a meal plan.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a class="ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Level up now
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Happy Eating, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function OGEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `${cus?.first_name}, You've Levelled Up! Earn Rewards with Your First Nourisha Order`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>OG</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>Congrats! You just placed another order with Nourisha, and that makes you a
                                            certified Flavour Enthusiast.  We've awarded
                                            you a badge for joining the adventure, plus you've earned your first star
                                            towards even more exciting rewards!
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBAIDAT</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBAIDAT</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Stars unlock exclusive perks like discounts, free meals, and even access to
                                            birthday treats. The more you explore
                                            Nourisha, the more points you earn, and the higher your rewards tier climbs.
                                        </p>
                                        <p>Are you ready to embark on a delicious, adventurous and rewarding journey to
                                            attain Culinary Legend?!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Continue Exploring
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>We can't wait to fuel your days with delicious, chef-cooked intercontinental
                                            meals.</p>
                                        <p>Enthusiastically Yours, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function UpgradedEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Closer than ever to an Ambassador!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Upgraded</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>Do you know that as you enjoy our mouth-watering meals, you're not just
                                            satisfying your taste buds; you're also climbing
                                            the ranks in our Culinary Legend Program. With every bite, you're closer and
                                            stand a chance to win amazing offers.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>From Novice to Ambassador, each tier brings you more perks and more reasons
                                            to celebrate your love for great
                                            intercontinental dishes. So, what are you waiting for? Dive into our diverse
                                            menu and taste the convenience of Nourisha
                                            delivered right to your doorstep!
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Continue Exploring
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Accumulate more stars to more delicious meals, order a meal plan.</p>
                                        <p>Keep feasting, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function RichEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Few steps to an Ambassador!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Rich</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>Officially a Rich sta, every bite, you're closer to earning more star points
                                            and stand a chance to win amazing offers.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>From Novice to Ambassador, each tier brings you more perks and more reasons
                                            to celebrate your love for great
                                            intercontinental dishes. So, what are you waiting for? Dive into our diverse
                                            menu and taste the convenience of Nourisha
                                            delivered right to your doorstep!
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Continue Exploring
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Accumulate more stars to more delicious meals, order a meal plan</p>
                                        <p>Keep feasting, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function InsiderEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Hey Foodie Adventurer! Earn Rewards with Every Bite!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Insider</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>You're officially a Foodie Adventurer! 🌍🍴 By exploring more than one
                                            intercontinenetal menu, you've earned an Insider
                                            star and a badge for your culinary curiosity.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Every dish you try brings you closer to more rewards and delicious surprises.
                                            Enjoy perks like discounts and special
                                            offers as you continue your journey through our diverse menu.
                                        </p>
                                        <p>Ready to discover more? Keep exploring and earning with every bite!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Continue Exploring
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Happy tasting, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function SpecialEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Roll out the Red Carpet For Our Top Trail Blazer! You!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Special</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>You're at the top of your game!  You are like the Special goose that lays the
                                            golden egg! You are Invincible!
                                        </p>
                                        <p>Sensei, you've earned yourself a new badge and topped every customer.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Continue Exploring
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Here's to more tasty adventures!
                                            Ready to continue your journey? two more to go!</p>
                                        <p>Cheers to your culinary adventure, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  export async function HeroEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Don’t Miss Your Shot FirstName! Exclusive Rewards Are Waiting!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Hero</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>A bold Heroic move, You're just a few steps away from becoming an Ambassador
                                            on the Nourisha leaderboard, but right now,
                                            exclusive offers are waiting for you to claim.
                                        </p>
                                        <p>Don't let this opportunity slip away, take action now to unlock your rewards
                                            and elevate your culinary experience!"</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" style="display: block;">
                                        <p>We would like to throw a party on your behalf but here is 20% off on your
                                            12th order! Your adventurous palate is paying
                                            off with more rewards and exclusive perks. Enjoy benefits like free
                                            delivery, special discounts, and early access to our
                                            latest dishes.</p>
                                        <p>Don't stop now! You are on fire! Order more meals and continue our journey to
                                            the top!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton" style="background: #DEF54C; color: black;" aria-label=""
                                            href="#">Order Now
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Here's to more tasty adventures!</p>
                                        <p>Ready to continue your journey? one more to go!</p>
                                        <p>Stay adventurous, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function AmbassadorEmail(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Way to Go, ${cus?.first_name}! You’ve Earned The Culinary Jackpot!🎉`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Ambassador</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>You hit Ambassador! With your latest star, you've earned a shiny new badge.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" style="display: block;">
                                        <p>Congratulations on reaching the final tier! You're now entitled to exclusive
                                            perks and other special rewards.</p>
                                        <p>We'll be in touch soon with your well-deserved reward, thank you for enjoying
                                            our delicious meals!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton"
                                            style="background: #DEF54C; color: black; margin-right: 10px;" aria-label=""
                                            href="#">Click Here Ambassador
                                        </a>
                                        <a class="ctaButton" style="background: #fff; color: #125309;"
                                            aria-label="Chat on WhatsApp" href="https://wa.me/4407931621298">Go
                                            to WhatsApp
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Happy Eating, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
    
  export async function Referral1(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `You’re a Nourisha MVP! Thank You for Your Referrals!!`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Referral</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .mini-white-section {
            background-color: #fff;
            color: #000;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
        }

        .white-section {
            background-color: #fff;
            color: #000;
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #125309;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>You've just made a legendary move! 🎉 As a Culinary Legend, you've earned an
                                            Insider badge from your recent order.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                            <tr>
                                                <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                    <span
                                                        style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">1</span>
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; width: 45px; height: 45px;">
                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730294542/email_template/gqhotyi8twa6odi2rkr7.png"
                                                        style="display: inline-block;" alt="">
                                                </td>
                                                <td
                                                    style="vertical-align: middle; display: inline-block; margin-left: 10px;">
                                                    <table role="presentation" width="100%" cellspacing="0"
                                                        cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="vertical-align: middle;">ZUBY</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                AMBASSADOR</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-block cream-section" align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" style="display: block;">
                                        <p>We're thrilled at the thought of you reaching the final level! As you climb
                                            higher, enjoy a special surprise waiting for
                                            you at the top, unlock exclusive rewards to celebrate our achievement!</p>
                                        <p>Ready to continue your legendary journey? One more to go!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="display: block; margin-bottom: 32px;">
                                        <a class=" ctaButton"
                                            style="background: #DEF54C; color: black; margin-right: 10px;" aria-label=""
                                            href="#">Level up now
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="stack-column-center" style="display: block;">
                                        <p>Happy Eating, <br>
                                            The Nourisha Team</p>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    // await mailJetSendMail(
    //   body,
    //   `${subject}`,
    //   [`${email}`]
    // );

    await sgMail.send({
      from: {
        name: "Nourisha",
        email: "hello@eatnourisha.com",
      },
      subject,
      to: email,
      html: body,
    });

  };
  
  export async function loyaltyreward(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Loyalty Bonus Unlocked! 99% Off Your 5th Meal Box`;
  
    const body = 
    `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Loyalty Reward</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        @font-face {
            font-family: 'New Spirit';
            src: url('https://eatnourisha.com/fonts/new_spirit/regular.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }

        /* Reset styles */
        * {
            box-sizing: border-box;
        }

        body,
        table,
        td,
        div,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
        }

        /* Base styles */
        body {
            width: 100% !important;
            height: 100% !important;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAFAFA;
        }

        h1,
        h2,
        h3 {
            /* Fallback chain from custom to web-safe fonts */
            font-family: 'New Spirit', 'Playfair', Georgia, 'Times New Roman', serif;
        }

        /* Typography */
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 16px;
        }

        h3 {
            font-size: 20px;
            margin-bottom: 16px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        /* Accessibility improvements */
        .visually-hidden {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        /* Container styles */
        .container {
            width: 100%;
            max-width: 940px;
            margin: 0 auto;
        }

        .content-block {
            padding: 32px 60px;
        }

        /* Responsive images */
        img {
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        /* Button styles */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FE7E00;
            margin-top: 32px;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 16px 0;
        }

        /* Color sections */
        .header-section {
            background-color: #FE7E00;
        }

        .black-section {
            background-color: #000;
            color: white;
            margin: 10px 0;
            padding: 16px 12px;
            border-radius: 8px;
        }

        .cream-section {
            background-color: #F9F3E4;
            color: #000;
            background-image: url('https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/v1/email_template/ro223hqewemvtgpaz2xb');
            background-repeat: no-repeat;
            background-position: 0 245px
        }

        .yellow-section {
            background-color: #DEF54C;
            color: #0E0F0C;
        }

        .ctaButton {
            display: inline-block;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 32px;
            border: 1.5px solid #28640A;
            box-shadow: 1px 6px 0px 0px #125309;
        }

        /* Social icons */
        .social-links {
            text-align: center;
            padding: 20px 0;
        }

        .social-icon {
            display: inline-block;
            margin: 0 8px;
        }

        .stack-column h3 {
            color: #DEF54C;
            margin-top: 0;
        }

        /* Responsive adjustments */
        @media only screen and (max-width: 600px) {
            .content-block {
                padding: 24px 20px !important;
            }

            h1 {
                font-size: 28px !important;
            }

            h2 {
                font-size: 24px !important;
            }

            h3 {
                font-size: 18px !important;
            }

            p {
                font-size: 14px !important;
            }

            .container {
                width: 100% !important;
            }

            .stack-column {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                text-align: center !important;
            }

            /* .cream-section {
                background-position: 0 385px !important;
            } */

            .mobile-hide {
                display: none !important;
            }

            .mobile-text-center {
                text-align: center !important;
            }
        }
    </style>
</head>

<body>


    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #FAFAFA;">
        <tr>
            <td>
                <table role="presentation" class="container" cellspacing="0" cellpadding="0" border="0" align="center">
                    <!-- Header Section -->
                    <tr>
                        <td class="header-section content-block">
                            <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                                alt="Nourisha Logo" width="240" style="margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block cream-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Congratulations! ${cus.first_name},</strong></p>
                                        <p>You've earned 99% off your 5th meal box with Nourisha.
                                            Ready to claim it? Here's how:
                                        </p>
                                        <ul style="margin-left: 20px; margin-bottom: 20px; color: #0E0F0C;">
                                            <li>Log into your Nourisha account</li>
                                            <li>Choose your 5th meal plan (T&C applied to previous meal plans selected)
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="content-block yellow-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" class="stack-column-center"
                                        style="max-width: 700px; width: 100%; display: block; text-align: center; margin: auto;">
                                        <h2 style="font-size: 40px; margin-bottom: 30px;">Apply coupon code
                                            “LOYALTYREWARD” and get 99% off your 5th meal box.</h2>
                                        <p>Don't wait! Use your reward and enjoy a meal almost on us.
                                            Thanks for being a loyal customer!</p>
                                        <p>Best regards, <br>
                                            Nourisha</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- App Download Section -->
                    <tr>
                        <td class="content-block mobile-text-center" align="center" style="background-color: #fff;">
                            <h2 style="color: #7DB83A;">Download the App</h2>
                            <p style="max-width: 345px; margin: 24px auto;">Get our mobile app on any device you use on
                                the App Store or Google Playstore</p>
                            <div style="text-align: center;">
                                <a href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                                        alt="Download on App Store" width="200">
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                                    style="display: inline-block; margin: 10px;">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                                        alt="Get it on Google Play" width="200">
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="content-block" style="text-align: center; background-color: #fff;">
                            <p>
                                Contact Us<br>
                                House of Nourisha | 71-75 Shelton Street | London<br>
                                <a href="tel:+4407867059890">07867059890</a> |
                                <a href="mailto:kitchen@eatnourisha.com">kitchen@eatnourisha.com</a> |
                                <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                            </p>
                            <p>Follow Us</p>
                            <div class="social-links">
                                <a href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/" class="social-icon"
                                    aria-label="Facebook">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                                        alt="Facebook">
                                </a>
                                <a href="https://x.com/eatnourisha" class="social-icon"
                                    aria-label="X (formerly Twitter)">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                                        alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/eatnourisha/" class="social-icon"
                                    aria-label="LinkedIn">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                                        alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/eatnourisha/" class="social-icon"
                                    aria-label="Instagram">
                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                                        alt="Instagram">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function emailCourse1(email: string, payload: any) {
      let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
    
      const subject = `Discover a world of flavorful African cuisine with Nourisha`;
    
      const body = 
      `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Nourisha Course</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      li,
      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello there, ${cus.first_name},</strong></p>
                      <p>
                        Looking for healthy and nutritious African, Asian and
                        European meal options that fit your busy lifestyle?
                      </p>
                      <p>Nourisha is your best bet!</p>
                      <p>
                        We offer a convenient and delicious solution for busy
                        individuals and families who want to enjoy authentic,
                        chef-cooked intercontinental meals without the hassle of
                        grocery shopping and cooking.
                      </p>
                    </td>
                  </tr>
                </table>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" style="color: #125309">
                      <h2>Here's what you get with Nourisha:</h2>
                    </td>
                  </tr>
                </table>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="border-collapse: separate; border-spacing: 8px"
                >
                  <tr>
                    <td class="stack-column black-section">
                      <h3>Weekly or monthly meal plans:</h3>
                      <p>Choose the option that best suits your needs.</p>
                    </td>
                    <td class="stack-column black-section">
                      <h3>Variety of Intercontinental meal plans:</h3>
                      <p>
                        We have exotic African, Asian and European meals options
                        to cater to your adventurous taste buds.
                      </p>
                    </td>
                    <td class="stack-column black-section">
                      <h3>Fresh, high-quality ingredients:</h3>
                      <p>We use traditional recipes and fresh ingredients.</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="stack-column black-section">
                      <h3>Chef-cooked meals</h3>
                      <p>
                        Our chefs have mastered the art of bringing the original
                        tastes of Africa, Asia and Europe straight to your
                        plate.
                      </p>
                    </td>
                    <td class="stack-column black-section">
                      <h3>Convenient delivery</h3>
                      <p>Get your meals delivered straight to your door.</p>
                    </td>
                    <td class="stack-column black-section">
                      <h3>Portion-controlled options</h3>
                      <p>
                        Maintain a healthy diet with our pre-portioned meals.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block">
                <p>
                  Joining our community is easy! Simply click subscribe, fill
                  out the short form and twice weekly, we will send you
                  entertaining, informative and delicious content that will
                  elevate your dining experience.
                </p>

                <ul class="" style="margin-left: 30px">
                  <li>
                    Be the first to know about new meal plans and special
                    offers.
                  </li>
                  <li>Receive valuable tips for healthy eating.</li>
                  <li>Better the quality of your life 10X.</li>
                </ul>
                <h3 style="color: #125309;">Choose a meal plan:</h3>
                <p>
                  As a thank you for subscribing, you get 5% off your first
                  order, see you on the other side of deliciousness!
                </p>
                <p>
                  With Foodie Love, <br />
                  The Nourisha Team
                </p>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `
      ;
      await mailJetSendMail(
        body,
        `${subject}`,
        [`${email}`]
      );
    };
    
  export async function emailCourse2(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = ` A world of flavourful Intercontinental Cuisine!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Nourisha Course</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello there, ${cus.first_name},</strong></p>
                      <p>
                        Congratulations! You made it into our email course where
                        you get to learn more about Nourisha and all the yummy
                        goodness that we offer. Your reward is somewhere within
                        this email. Keep reading!
                      </p>
                      <p>
                        At Nourisha, we pride ourselves on delivering the taste
                        of home straight to your doorstep, even when life gets
                        busy. Our chefs ensure that our meals are carefully made
                        with homemade recipes and fresh ingredients that allow
                        you to experience the rich tastes of Africa, Asian and
                        European meals.
                      </p>
                      <p>
                        Nourisha lifestyle is more than just food, you can earn
                        gift cards, 5% discount on your first order, loyalty
                        rewards and many more.
                      </p>
                      <p>
                        It's not just about food, it's about the feeling of home
                        that comes with every meal. With Nourisha, you'll
                        rediscover the joy of home-cooked meals without the
                        hassle of grocery shopping or meal prep. Click the
                        button to join the community..
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #def54c; color: black"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Take me home
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                      width="60%"
                    >
                      <p>
                        Sit back and let us do the cooking - we promise you
                        won't be disappointed.
                      </p>
                      <p>
                        With Foodie Love, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function emailCourse3(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Can you handle all this convenience?`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Nourisha Course</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #0e0f0c;
      }

      .ctaButton {
        display: inline-block;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello there, ${cus.first_name},</strong></p>
                      <p>
                        What does convenience mean to you? Is it the ability to
                        focus on what is most important to you without having to
                        handle pesky chores? Is it being able to get what you
                        want, when you want it without the stress of going
                        through the motions of arriving at the end product?
                      </p>
                      <p>
                        Whatever convenience means for you, we can relate.
                        Especially when it comes to cooking.
                      </p>
                      <p>
                        With Nourisha, you no longer have to make runs to the
                        grocery store or spend hours meal prepping. Neither do
                        you have to worry about what to eat nor reconsider
                        eating the meals you love because it costs an arm and a
                        leg.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content-block yellow-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p>
                        With our discounted African (£80/week) and
                        Asian/European (£70/week) meal plans, you can have
                        delicious ready made meals of your choosing delivered to
                        your home or any location of your choice in the UK.
                      </p>
                      <p>
                        Our flexible delivery schedules (between Tuesdays -
                        Fridays) ensure that you get your meals when you need
                        them. Our packaging keeps them fresh and ready to eat.
                      </p>
                      <p>
                        Plus, with free delivery to all UK cities for our
                        discounted meal plans, convenience has never been so
                        affordable.
                      </p>
                      <p>
                        Ready to give up the kitchen struggles and live your
                        best life? Choose a meal plan now.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a
                        class="ctaButton"
                        style="background: #fff; color: #fe7e00"
                        aria-label="Claim Welcome Discount Now"
                        href="#"
                        >Choose a Meal Plan
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="stack-column"
                      style="margin-top: 32px; display: block"
                      width="60%"
                    >
                      <p>
                        Take the hassle out of mealtime and let Nourisha do the
                        heavy lifting.
                      </p>
                      <p>
                        With Foodie Love, <br />
                        The Nourisha Team
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- App Download Section -->
            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  
  export async function emailCourse4(email: string, payload: any) {
    let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  
    const subject = `Tired of Quick Fixes ${cus?.first_name}? Taste the Difference with Nourisha!`;
  
    const body = 
    `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Nourisha Course</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap");

      @font-face {
        font-family: "New Spirit";
        src: url("https://eatnourisha.com/fonts/new_spirit/regular.otf")
          format("opentype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Reset styles */
      * {
        box-sizing: border-box;
      }

      body,
      table,
      td,
      div,
      p,
      ul,
      li {
        margin: 0;
        padding: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        line-height: 1.5;
      }

      /* Base styles */
      body {
        width: 100% !important;
        height: 100% !important;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #fafafa;
      }

      h1,
      h2,
      h3 {
        /* Fallback chain from custom to web-safe fonts */
        font-family: "New Spirit", "Playfair", Georgia, "Times New Roman", serif;
      }

      /* Typography */
      h1 {
        font-size: 32px;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 28px;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
      }

      /* Accessibility improvements */
      .visually-hidden {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      /* Container styles */
      .container {
        width: 100%;
        max-width: 940px;
        margin: 0 auto;
      }

      .content-block {
        padding: 32px 60px;
      }

      /* Responsive images */
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      /* Button styles */
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #fe7e00;
        margin-top: 32px;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        margin: 16px 0;
      }

      /* Color sections */
      .header-section {
        background-color: #fe7e00;
      }

      .black-section {
        background-color: #000;
        color: white;
        margin: 10px 0;
        padding: 16px 12px;
        border-radius: 8px;
      }

      .cream-section {
        background-color: #f9f3e4;
        color: #000;
      }

      .yellow-section {
        background-color: #def54c;
        color: #28640a;
      }

      .ctaButton {
        display: inline-block;
        margin-top: 32px;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 32px;
        border: 1.5px solid #28640a;
        box-shadow: 1px 6px 0px 0px #125309;
      }

      /* Social icons */
      .social-links {
        text-align: center;
        padding: 20px 0;
      }

      .social-icon {
        display: inline-block;
        margin: 0 8px;
      }

      .stack-column h3 {
        color: #def54c;
        margin-top: 0;
      }

      /* Responsive adjustments */
      @media only screen and (max-width: 600px) {
        .content-block {
          padding: 24px 20px !important;
        }

        h1 {
          font-size: 28px !important;
        }

        h2 {
          font-size: 24px !important;
        }

        h3 {
          font-size: 18px !important;
        }

        p {
          font-size: 16px !important;
        }

        .container {
          width: 100% !important;
        }

        .stack-column {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
        }

        .stack-column-center {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          direction: ltr !important;
          text-align: center !important;
        }

        .mobile-hide {
          display: none !important;
        }

        .mobile-text-center {
          text-align: center !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tr>
        <td>
          <table
            role="presentation"
            class="container"
            cellspacing="0"
            cellpadding="0"
            border="0"
            align="center"
          >
            <!-- Header Section -->
            <tr>
              <td class="header-section content-block">
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286587/email_template/omwjfahneposqvue4nc2.png"
                  alt="Nourisha Logo"
                  width="240"
                  style="margin: 0 auto"
                />
              </td>
            </tr>

            <!-- Welcome Content -->
            <tr>
              <td class="content-block cream-section">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td class="stack-column" width="60%">
                      <p><strong>Hello ${cus.first_name},</strong></p>
                      <p>
                        Are you tired of compromising on the quality of your
                        meals due to your hectic schedule? It's time to turn the
                        tables and savour the richness of life with Nourisha's
                        delicious and wholesome intercontinental meals.
                      </p>
                      <p>
                        At Nourisha, we're more than just a meal delivery
                        service - we're your secret ingredient for a better
                        quality of life. Our chef-crafted meals are designed to
                        nourish your body and soul, providing a taste of home
                        even when life gets chaotic. Imagine coming home after a
                        long day and not having to cook lunch or dinner. What a
                        relief!
                      </p>
                      <p>
                        Say goodbye to junk, quick fixes, bland, uninspired
                        meals and welcome a world of gourmet meals that not only
                        tantalise your taste buds but also elevate your overall
                        well-being. Nourisha guarantees 10X better nutrition and
                        quality of life, bringing joy and satisfaction to every
                        meal.
                      </p>
                      <p>
                        Ready to savour a life filled with flavorful delights?
                        Join the Nourisha Clan today and embrace the uplifting
                        power of authentic intercontinental cuisine.
                      </p>
                      <p>
                        To a delectable, nourished life, <br />
                        Your friends at Nourisha
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                class="content-block mobile-text-center"
                align="center"
                style="background-color: #fff"
              >
                <h2 style="color: #7db83a">Download the App</h2>
                <p style="max-width: 345px; margin: 24px auto">
                  Get our mobile app on any device you use on the App Store or
                  Google Playstore
                </p>
                <div style="text-align: center">
                  <a
                    href="https://apps.apple.com/ng/app/nourisha-budget-meal-planner/id6451458690"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/app_store_rko93u"
                      alt="Download on App Store"
                      width="200"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="200"
                    />
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="content-block"
                style="text-align: center; background-color: #fff"
              >
                <p>
                  Contact Us<br />
                  House of Nourisha | 71-75 Shelton Street | London<br />
                  <a href="tel:+4407867059890">07867059890</a> |
                  <a href="mailto:kitchen@eatnourisha.com"
                    >kitchen@eatnourisha.com</a
                  >
                  |
                  <a href="https://www.eatnourisha.com">www.eatnourisha.com</a>
                </p>
                <p>Follow Us</p>
                <div class="social-links">
                  <a
                    href="https://www.facebook.com/share/xoCGqMBK1htcCNwZ/"
                    class="social-icon"
                    aria-label="Facebook"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/cjoih4xgydqrx05giw1e.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://x.com/eatnourisha"
                    class="social-icon"
                    aria-label="X (formerly Twitter)"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/spcrhccsei0psubzulsy.png"
                      alt="X"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/eatnourisha/"
                    class="social-icon"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286951/email_template/t6uzvkqvdwltjrvagffa.png"
                      alt="LinkedIn"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/eatnourisha/"
                    class="social-icon"
                    aria-label="Instagram"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1730286950/email_template/dezbqbsv58trjfdxqooz.png"
                      alt="Instagram"
                    />
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `
    ;
    await mailJetSendMail(
      body,
      `${subject}`,
      [`${email}`]
    );
  };
  