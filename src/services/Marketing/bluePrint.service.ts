import customer, { Customer } from "../../models/customer";
import config from "../../config/index";
import sgMail from "@sendgrid/mail";
import { IPaginationFilter } from "interfaces";
import { PipelineStage } from "mongoose";
// import { mailJetSendMail } from "../../config/mailjet";
// import { Order, order } from "../../models";
// import axios from "axios";

export async function getCustomersByRank(filter?: IPaginationFilter): Promise<any[]> {
  const rankOrder = ["Ambassador", "Hero", "Special", "Insider", "Rich", "Upgraded", "OG", "Novice"];

  if (!filter) {
    filter = {};
  }

  if (!filter.page) {
    filter.page = "1";
  }

  if (!filter.limit) {
    filter.limit = "10";
  }

  // Define the aggregation pipeline with explicit types for each stage
  const aggregationPipeline: PipelineStage[] = [
    {
      $match: {
        level: { $ne: "Newbie", $exists: true },
      },
    },
    {
      $addFields: {
        rankIndex: {
          $switch: {
            branches: rankOrder.map((rank, index) => ({
              case: { $eq: ["$level", rank] },
              then: index,
            })),
            default: rankOrder.length,
          },
        },
      },
    },
    { $sort: { rankIndex: 1, createdAt: -1 } },
    {
      $project: {
        rankIndex: 0,
      },
    },
    { $skip: (Math.abs(parseInt(filter?.page!)) - 1) * Math.abs(parseInt(filter?.limit!)) }, // Skip documents based on page and limit
    { $limit: Math.abs(parseInt(filter?.limit!)) },
  ];

  // Execute the aggregation pipeline
  const customers = await customer.aggregate(aggregationPipeline).exec();
  return customers;
}

export async function emailSender(body: string, email: string, subject: string) {
  sgMail.setApiKey(config.SENDGRID_KEY);

  await sgMail.send({
    from: {
      name: "Nourisha",
      email: "hello@eatnourisha.com",
    },
    subject,
    to: email,
    html: body,
  });

  console.log(`${subject} email sent to ${email}`);
  // await mailJetSendMail(body, `${subject}`, [`${email}`]);
  // await sendSMTPEmail(email, subject, 'hi', body)

  // const request = mailjetClient.post('send', { version: 'v3.1' }).request({
  //   Messages: [
  //     {
  //       From: {
  //         Email: 'hello@eatnourisha.com',
  //         Name: 'Nourisha',
  //       },
  //       To: email.map((email) => ({
  //         Email: email,
  //       })),
  //       Subject: subject,
  //       HTMLPart: body,
  //     },
  //   ],
  // });

  // // const result = await request;
  // // console.log(`result: ${JSON.stringify(result.body)}`);
  // await request;

  //   const url = "https://api.brevo.com/v3/smtp/email";
  // const apiKey = process.env.BREVO_KEY;
  // const load = {
  //   sender: {
  //     email: "hello@eatnourisha.com",
  //     name: "Nourisha",
  //   },
  //   to: [
  //     {
  //       email: email,
  //     },
  //   ],
  //   subject: subject,
  //   htmlContent: body,
  // };

  // const headers = {
  //   "Content-Type": "application/json",
  //   "api-key": apiKey,
  // };
  // const response = await axios.post(url, load, { headers });
  // return response.data;
}

export async function welcomeEmail1(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Welcome To Nourisha`;

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
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
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
                  Are you craving rich Intercontinental cuisines? Look no further! Nourisha brings you a diverse menu of delicious chef-cooked meals, delivered right to your doorstep. Whether you're from Africa, Asia or Europe, our flavours knows no boundaries. Taste convenience with our meal-prep and food delivery meal plans, available in all UK cities.                  
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
                        Asian-European delights from £70/week - delivery
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
                        Not ready for a meal plan? No problem! Our pay-as-you-go model
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
                      width="100" height="100"
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.eatnourisha.app"
                    style="display: inline-block; margin: 10px"
                  >
                    <img
                      src="https://res.cloudinary.com/drivfk4v3/image/upload/f_auto,q_auto/play_store_pud7kw"
                      alt="Get it on Google Play"
                      width="100" height="100"
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
                  <a href="mailto:hello@eatnourisha.com"
                    >hello@eatnourisha.com</a
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

    `;

  await emailSender(body, email, subject);
}

export async function NoviceEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Hey Rising Star! Level Up & Earn Rewards!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Level up now
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function OGEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();


  const subject = `${cus?.first_name}, You've Levelled Up! Earn Rewards with Your First Nourisha Order`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Continue Exploring
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function UpgradedEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Closer than ever to an Ambassador!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Continue Exploring
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function RichEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Few steps to an Ambassador!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
              </td>
            </tr>


                    <!-- Welcome Content -->
                    <tr>
                        <td class="content-block white-section">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td class="stack-column" width="60%">
                                        <p><strong>Hello ${cus.first_name}!</strong></p>
                                        <p>Officially a Rich star, every bite, you're closer to earning more star points
                                            and stand a chance to win amazing offers.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="stack-column"
                                        style="background-color: black; color: #fff;padding: 18px; border-radius: 10px;">
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Continue Exploring
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function InsiderEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Hey Foodie Adventurer! Earn Rewards with Every Bite!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Continue Exploring
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function SpecialEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Roll out the Red Carpet For Our Top Trail Blazer! You!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Continue Exploring
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}
export async function HeroEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Don’t Miss Your Shot FirstName! Exclusive Rewards Are Waiting!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Order Now
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function AmbassadorEmail(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const ranks = await getCustomersByRank();

  const subject = `Way to Go, ${cus?.first_name}! You’ve Earned The Culinary Jackpot!🎉`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                        ${ranks
                                          .map(
                                            (rank, i) =>
                                              `<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                                border="0" style="border-bottom: 1px solid #FFFFFF1A; padding: 10px;">
                                                <tr>
                                                    <td style="vertical-align: middle; display: inline-block; width: 20px">
                                                        <span
                                                            style="display: inline-block; background: linear-gradient(90.53deg, #AE8625 0.57%, #F7EF8A 40.8%, #D2AC47 76.69%, #EDC967 109.32%); border-radius: 50%; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
                                                              i + 1
                                                            }</span>
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
                                                                <td style="vertical-align: middle;">${rank.first_name.toUpperCase()}</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="vertical-align: middle; color: #FFFFFFB2; font-weight: 500">
                                                                    ${rank.level.toUpperCase()}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>`
                                          )
                                          .join("")}
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
                                            href="https://www.eatnourisha.com">Click Here Ambassador
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function Referral1(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();
  const subject = `You’re a Nourisha MVP! Thank You for Your Referrals!!`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                            href="https://www.eatnourisha.com">Level up now
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}

export async function loyaltyreward(email: string, payload: any) {
  let cus = await customer.findById(payload?.customer).lean<Customer>().exec();

  const subject = `Loyalty Bonus Unlocked! 99% Off Your 5th Meal Box`;

  const body = `
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
                <img
                  src="https://res.cloudinary.com/drivfk4v3/image/upload/v1732199867/xeb2vue12lxgmgmxza7x.png"
                  alt="Nourisha Logo"
                  width="150"
                  style="margin: 0 auto"
                />
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
                                <a href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a> |
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

</html>    `;
  await emailSender(body, email, subject);
}
