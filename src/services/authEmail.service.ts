import { createError } from "../utils";
import sgMail from "@sendgrid/mail";
import config from "../config";
// import { Customer, customer } from "../models";

export async function sendMobilResetEmail(email: string, payload: any, isTesting: boolean) {
  const subject = `🥺Reset Password`;

  const body = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="format-detection" content="date=no" />
  <meta name="format-detection" content="address=no" />
  <meta name="format-detection" content="email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Application Denied</title>
  <style>
    @media all {
      /* cyrillic-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 100;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjEYTLVdlTOr0s.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
      }

      /* cyrillic */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 100;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjNYTLVdlTOr0s.woff2) format("woff2");
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }

      /* latin-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 100;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjHYTLVdlTOr0s.woff2) format("woff2");
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }

      /* latin */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 100;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjJYTLVdlTO.woff2) format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
          U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* cyrillic-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: local("Fira Sans Light"), local("FiraSans-Light"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreSxf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
      }

      /* cyrillic */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: local("Fira Sans Light"), local("FiraSans-Light"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreQhf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }

      /* latin-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: local("Fira Sans Light"), local("FiraSans-Light"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreSBf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }

      /* latin */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: local("Fira Sans Light"), local("FiraSans-Light"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreRhf6Xl7Glw.woff2) format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
          U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* cyrillic-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 400;
        src: local("Fira Sans Regular"), local("FiraSans-Regular"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
      }

      /* cyrillic */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 400;
        src: local("Fira Sans Regular"), local("FiraSans-Regular"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format("woff2");
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }

      /* latin-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 400;
        src: local("Fira Sans Regular"), local("FiraSans-Regular"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format("woff2");
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }

      /* latin */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 400;
        src: local("Fira Sans Regular"), local("FiraSans-Regular"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
          U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* cyrillic-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 500;
        src: local("Fira Sans Medium"), local("FiraSans-Medium"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSxf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
      }

      /* cyrillic */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 500;
        src: local("Fira Sans Medium"), local("FiraSans-Medium"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }

      /* latin-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 500;
        src: local("Fira Sans Medium"), local("FiraSans-Medium"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSBf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }

      /* latin */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 500;
        src: local("Fira Sans Medium"), local("FiraSans-Medium"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
          U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* cyrillic-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 700;
        src: local("Fira Sans Bold"), local("FiraSans-Bold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSxf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
      }

      /* cyrillic */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 700;
        src: local("Fira Sans Bold"), local("FiraSans-Bold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }

      /* latin-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 700;
        src: local("Fira Sans Bold"), local("FiraSans-Bold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSBf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }

      /* latin */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 700;
        src: local("Fira Sans Bold"), local("FiraSans-Bold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
          U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

      /* cyrillic-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 800;
        font-display: swap;
        src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSxf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
      }

      /* cyrillic */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 800;
        font-display: swap;
        src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
      }

      /* latin-ext */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 800;
        font-display: swap;
        src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSBf6Xl7Gl3LX.woff2) format("woff2");
        unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }

      /* latin */
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 800;
        font-display: swap;
        src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
          url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
          U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
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

    #outlook a {
      padding: 0;
    }

    .ReadMsgBody,
    .ExternalClass {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass td,
    .ExternalClass div,
    .ExternalClass span,
    .ExternalClass font {
      line-height: 100%;
    }

    div[style*="margin: 14px 0"],
    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }

    table,
    td,
    th {
      mso-table-lspace: 0 !important;
      mso-table-rspace: 0 !important;
      border-collapse: collapse;
    }

    body,
    td,
    th,
    p,
    div,
    li,
    a,
    span {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      mso-line-height-rule: exactly;
    }

    img {
      border: 0;
      outline: none;
      line-height: 100%;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
    }

    .pc-gmail-fix {
      display: none;
      display: none !important;
    }
  </style>
  <style>
    @media (max-width: 620px) {
      .pc-project-body {
        min-width: 0px !important;
      }

      .pc-project-container {
        width: 100% !important;
      }

      table.pc-w620-spacing-0-10-0-0 {
        margin: 0px 10px 0px 0px !important;
      }

      td.pc-w620-spacing-0-10-0-0,
      th.pc-w620-spacing-0-10-0-0 {
        margin: 0 !important;
        padding: 0px 10px 0px 0px !important;
      }

      .pc-w620-padding-30-30-30-30 {
        padding: 30px 30px 30px 30px !important;
      }

      .pc-w620-view-vertical,
      .pc-w620-view-vertical > tbody,
      .pc-w620-view-vertical > tbody > tr,
      .pc-w620-view-vertical > tbody > tr > th,
      .pc-w620-view-vertical > tr,
      .pc-w620-view-vertical > tr > th {
        display: block !important;
        width: 100% !important;
      }

      table.pc-w620-spacing-15-0-0-0 {
        margin: 15px 0px 0px 0px !important;
      }

      td.pc-w620-spacing-15-0-0-0,
      th.pc-w620-spacing-15-0-0-0 {
        margin: 0 !important;
        padding: 15px 0px 0px 0px !important;
      }

      .pc-w620-padding-0-0-30-0 {
        padding: 0px 0px 30px 0px !important;
      }

      .pc-w620-padding-45-35-45-35 {
        padding: 45px 35px 45px 35px !important;
      }

      table.pc-w620-spacing-0-0-22-0 {
        margin: 0px 0px 22px 0px !important;
      }

      td.pc-w620-spacing-0-0-22-0,
      th.pc-w620-spacing-0-0-22-0 {
        margin: 0 !important;
        padding: 0px 0px 22px 0px !important;
      }

      table.pc-w620-spacing-0-0-25-0 {
        margin: 0px 0px 25px 0px !important;
      }

      td.pc-w620-spacing-0-0-25-0,
      th.pc-w620-spacing-0-0-25-0 {
        margin: 0 !important;
        padding: 0px 0px 25px 0px !important;
      }

      .pc-w620-padding-15-15-15-15 {
        padding: 15px 15px 15px 15px !important;
      }
    }

    @media (max-width: 520px) {
      .pc-w520-padding-25-25-25-25 {
        padding: 25px 25px 25px 25px !important;
      }

      .pc-w520-padding-40-30-40-30 {
        padding: 40px 30px 40px 30px !important;
      }

      .pc-w520-padding-10-10-10-10 {
        padding: 10px 10px 10px 10px !important;
      }
    }
  </style>
  <style>
    @media screen {
      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 400;
        src: url("https://fonts.gstatic.com/s/firasans/v16/va9E4kDNxMZdWfMOD5VvmYjN.woff") format("woff"),
          url("https://fonts.gstatic.com/s/firasans/v16/va9E4kDNxMZdWfMOD5VvmYjL.woff2") format("woff2");
      }

      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 500;
        src: url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnZKveSBf8.woff") format("woff"),
          url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnZKveSBf6.woff2") format("woff2");
      }

      @font-face {
        font-family: "Fira Sans";
        font-style: normal;
        font-weight: 700;
        src: url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnLK3eSBf8.woff") format("woff"),
          url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnLK3eSBf6.woff2") format("woff2");
      }
    }
  </style>
  <!--[if mso]>
    <style type="text/css">
      .pc-font-alt {
        font-family: Helvetica, Arial, sans-serif !important;
      }
    </style>
  <![endif]-->
  <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG />
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  <![endif]-->
</head>

<body
  class="pc-font-alt"
  style="
    width: 100% !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
    line-height: 1.5;
    color: #2d3a41;
    mso-line-height-rule: exactly;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    font-variant-ligatures: none;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f4f4f4;
  "
>
  <table
    class="pc-project-body"
    style="table-layout: fixed; min-width: 600px"
    width="100%"
    border="0"
    cellspacing="0"
    cellpadding="0"
    role="presentation"
  >
    <tr>
      <td align="center" valign="top" bgcolor="#f4f4f4">
        <table
          class="pc-project-container"
          style="width: 720px; max-width: 720px"
          width="600"
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
        >
          <tr>
            <td style="padding: 20px 0px 20px 0px" align="left" valign="top">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  <td style="padding: 0px 0px 0px 0px">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                      <tr>
                        <td
                          valign="top"
                          class="pc-w520-padding-25-25-25-25 pc-w620-padding-30-30-30-30"
                          style="padding: 36px 40px 36px 40px; border-radius: 0px; background-color: #220f01"
                          bgcolor="#220f01"
                        >
                          <table class="image-block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr class="image-block-tr">
                              <td class="image-block-td" align="center" valign="top">
                                <a class="pc-font-alt" style="text-decoration: none" href="https://rapydcars.com">
                                  <img
                                    src="https://res.cloudinary.com/drivfk4v3/image/upload/v1688489961/Nourisha/full-logo_pzmxnm.png"
                                    width="129"
                                    height="42"
                                    style="
                                      border: 0;
                                      outline: 0;
                                      line-height: 100%;
                                      -ms-interpolation-mode: bicubic;
                                      width: 129px;
                                      max-width: 100%;
                                      height: auto;
                                    "
                                    alt=""
                                  />
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  <td style="padding: 0px 0px 0px 0px">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                      <tr>
                        <td
                          valign="top"
                          class="pc-w520-padding-40-30-40-30 pc-w620-padding-45-35-45-35"
                          style="padding: 50px 40px 50px 40px; border-radius: 0px; background-color: #ffffff"
                          bgcolor="#ffffff"
                        >
                          <table class="list" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr class="list-tr">
                              <td class="list-td" valign="top">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  class="list-horizontal pc-w620-view-vertical"
                                >
                                  <tr class="list-horizontal-tr">
                                    <th
                                      class="text-block-container-td"
                                      valign="top"
                                      style="font-weight: normal; text-align: left; padding: 0px 0px 0px 0px"
                                    >
                                      <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                        <tr class="text-block-tr">
                                          <td
                                            valign="top"
                                            class="text-block-td pc-font-alt"
                                            style="
                                              mso-line-height: exactly;
                                              line-height: 34px;
                                              letter-spacing: -0.4px;
                                              font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                              font-size: 24px;
                                              font-weight: bold;
                                              color: #151515;
                                            "
                                          >
                                            Hello ${payload?.name},
                                          </td>
                                        </tr>
                                      </table>
                                    </th>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="line-height: 1px; font-size: 1px" height="13">&nbsp;</td>
                            </tr>
                          </table>
                          <table class="text-block-wrapper" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td class="text-block-wrapper-td" style="padding: 0px 0px 40px 0px" valign="top">
                                <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                  <tr class="text-block-tr">
                                    <td
                                      valign="top"
                                      class="text-block-td pc-font-alt"
                                      style="
                                        mso-line-height: exactly;
                                        line-height: 28px;
                                        letter-spacing: -0.2px;
                                        font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                        font-size: 18px;
                                        font-weight: normal;
                                        color: #5c5c5c;
                                        padding: 16px 0px 0px 0px;
                                      "
                                    >
                                      <!-- email content -->
                                      <span
                                        >Reset your password using the code below to continue enjoying well made food on a budget.
                                        <br /></span
                                      ><span
                                        style="
                                          font-size: 26px;
                                          font-weight: 600;
                                          font-style: normal;
                                          color: #fe7e00;
                                          margin-top: 16px;
                                          letter-spacing: 4px;
                                          display: inline-block;
                                        "
                                        class="hightlight"
                                        data-postcards-selection-id="f3ed4b87-abc2-4428-b0a2-025b285119ce"
                                        >${payload.code}</span
                                      ><span></span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td style="padding: 0px 0px 40px 0px !important"></td>
                                  </tr>
                                  <!-- <tr>
                                    <td>
                                      <a
                                        href="${payload?.link}"
                                        style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 16px;
                                          font-weight: 500;
                                          color: white;
                                          background: #fe7e00;
                                          padding: 10px 40px 10px 40px !important;
                                          text-decoration: none;
                                          border-radius: 8px;
                                        "
                                        >Reset Password</a
                                      >
                                    </td>
                                  </tr> -->
                                </table>
                              </td>
                            </tr>
                          </table>
                          <table class="list" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr class="list-tr">
                              <td class="list-td" valign="top" style="border-radius: 0px 0px 0px 0px">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  width="100%"
                                  class="list-horizontal pc-w620-view-vertical"
                                >
                                  <tr class="list-horizontal-tr">
                                    <th valign="top" width="50%" style="font-weight: normal; text-align: left; width: 50%"></th>
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
              </table>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  <td style="padding: 0px 0px 0px 0px">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                      <tr>
                        <td
                          valign="top"
                          class="pc-w520-padding-10-10-10-10 pc-w620-padding-15-15-15-15"
                          style="padding: 20px 20px 20px 20px; border-radius: 0px; background-color: #220f01"
                          bgcolor="#220f01"
                        >
                          <table class="list" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr class="list-tr">
                              <td class="list-td" valign="top">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  width="100%"
                                  class="list-horizontal pc-w620-view-vertical"
                                >
                                  <tr class="list-horizontal-tr">
                                    <th
                                      class="card-container-td"
                                      width="50%"
                                      valign="top"
                                      style="font-weight: normal; text-align: left; width: 50%"
                                    >
                                      <table class="card" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tr class="card-tr">
                                          <td valign="top" class="card-td" style="padding: 20px 20px 20px 20px">
                                            <table
                                              class="card-inner"
                                              width="100%"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                            >
                                              <tr>
                                                <th
                                                  class="text-block-container-td"
                                                  valign="top"
                                                  style="font-weight: normal; text-align: left; padding: 0px 0px 10px 0px"
                                                >
                                                  <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                    <tr class="text-block-tr">
                                                      <td
                                                        valign="top"
                                                        class="text-block-td pc-font-alt"
                                                        style="
                                                          mso-line-height: exactly;
                                                          line-height: 24px;
                                                          font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                          font-size: 18px;
                                                          font-weight: 500;
                                                          color: #ffffff;
                                                        "
                                                      >
                                                        Follow Us.
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </th>
                                              </tr>

                                              <tr>
                                                <th valign="top" style="font-weight: normal; text-align: left">
                                                  <table
                                                    class="list"
                                                    width="100%"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    role="presentation"
                                                  >
                                                    <tr class="list-tr">
                                                      <td class="list-td" valign="top">
                                                        <table
                                                          border="0"
                                                          cellpadding="0"
                                                          cellspacing="0"
                                                          role="presentation"
                                                          class="list-horizontal"
                                                        >
                                                          <tr class="list-horizontal-tr">
                                                            <th valign="top" style="font-weight: normal; text-align: left">
                                                              <table
                                                                class="image-block"
                                                                width="100%"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                role="presentation"
                                                              >
                                                                <tr class="image-block-tr">
                                                                  <td
                                                                    class="image-block-td"
                                                                    valign="top"
                                                                    style="padding: 0px 20px 0px 0px"
                                                                  >
                                                                    <a
                                                                      class="pc-font-alt"
                                                                      style="text-decoration: none"
                                                                      href="https://www.facebook.com/people/Eatnourisha/100068259570536/?mibextid=LQQJ4d&_rdc=1&_rdr"
                                                                    >
                                                                      <img
                                                                        src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/facebook-white_zniyn5.png"
                                                                        width="20"
                                                                        height="19"
                                                                        style="
                                                                          border: 0;
                                                                          outline: 0;
                                                                          line-height: 100%;
                                                                          -ms-interpolation-mode: bicubic;
                                                                          width: 20px;
                                                                          max-width: 100%;
                                                                          height: auto;
                                                                        "
                                                                        alt=""
                                                                      />
                                                                    </a>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </th>
                                                            <th valign="top" style="font-weight: normal; text-align: left">
                                                              <table
                                                                class="image-block"
                                                                width="100%"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                role="presentation"
                                                              >
                                                                <tr class="image-block-tr">
                                                                  <td
                                                                    class="image-block-td"
                                                                    valign="top"
                                                                    style="padding: 0px 20px 0px 0px"
                                                                  >
                                                                    <a
                                                                      class="pc-font-alt"
                                                                      style="text-decoration: none"
                                                                      href="https://twitter.com/nourisha12/status/1652961343736086529?s=46"
                                                                    >
                                                                      <img
                                                                        src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/twitter-white_k7lk4y.png"
                                                                        width="22"
                                                                        height="17"
                                                                        style="
                                                                          border: 0;
                                                                          outline: 0;
                                                                          line-height: 100%;
                                                                          -ms-interpolation-mode: bicubic;
                                                                          width: 22px;
                                                                          max-width: 100%;
                                                                          height: auto;
                                                                        "
                                                                        alt=""
                                                                      />
                                                                    </a>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </th>
                                                            <th valign="top" style="font-weight: normal; text-align: left">
                                                              <table
                                                                class="image-block"
                                                                width="100%"
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                role="presentation"
                                                              >
                                                                <tr class="image-block-tr">
                                                                  <td
                                                                    class="image-block-td"
                                                                    valign="top"
                                                                    style="padding: 0px 20px 0px 0px"
                                                                  >
                                                                    <a
                                                                      class="pc-font-alt"
                                                                      style="text-decoration: none"
                                                                      href="https://www.instagram.com/eatnourisha/?igshid=MmJiY2I4NDBkZg%3D%3D"
                                                                    >
                                                                      <img
                                                                        src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/instagram-white_pp0hj4.png"
                                                                        width="20"
                                                                        height="20"
                                                                        style="
                                                                          border: 0;
                                                                          outline: 0;
                                                                          line-height: 100%;
                                                                          -ms-interpolation-mode: bicubic;
                                                                          width: 20px;
                                                                          max-width: 100%;
                                                                          height: auto;
                                                                        "
                                                                        alt=""
                                                                      />
                                                                    </a>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </th>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </th>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <div><br /></div>
                                                  <div><br /></div>
                                                  <div><br /></div>
                                                  <div><br /></div>
                                                  <div><br /></div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <th
                                                  class="text-block-container-td"
                                                  valign="top"
                                                  style="font-weight: normal; text-align: left; padding: 0px 0px 12px 0px"
                                                >
                                                  <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                    <tr class="text-block-tr">
                                                      <td
                                                        valign="top"
                                                        class="text-block-td pc-font-alt"
                                                        style="
                                                          mso-line-height: exactly;
                                                          line-height: 20px;
                                                          letter-spacing: -0.2px;
                                                          font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                          font-size: 14px;
                                                          font-weight: 600;
                                                          color: white;
                                                          padding: 0px 0px 0px 0px !important;
                                                        "
                                                      >
                                                        ©2023 Nourisha&nbsp;
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </th>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </th>
                                    <th
                                      class="card-container-td"
                                      width="50%"
                                      valign="top"
                                      style="font-weight: normal; text-align: left; width: 50%"
                                    >
                                      <table class="card" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                        <tr class="card-tr">
                                          <td valign="top" class="card-td" style="padding: 20px 20px 20px 20px">
                                            <table
                                              class="card-inner"
                                              width="100%"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                            >
                                              <tr>
                                                <th
                                                  class="text-block-container-td"
                                                  valign="top"
                                                  style="font-weight: normal; text-align: left; padding: 0px 0px 10px 0px"
                                                >
                                                  <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                    <tr class="text-block-tr">
                                                      <td
                                                        valign="top"
                                                        class="text-block-td pc-font-alt"
                                                        style="
                                                          mso-line-height: exactly;
                                                          line-height: 24px;
                                                          letter-spacing: -0.2px;
                                                          font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                          font-size: 18px;
                                                          font-weight: 500;
                                                          color: #ffffff;
                                                        "
                                                      >
                                                        Contact us
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </th>
                                              </tr>
                                              <tr>
                                                <th
                                                  class="text-block-container-td pc-w620-spacing-0-0-25-0"
                                                  valign="top"
                                                  style="font-weight: normal; text-align: left; padding: 0px 0px 45px 0px"
                                                >
                                                  <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                    <tr class="text-block-tr">
                                                      <td
                                                        valign="top"
                                                        class="text-block-td pc-font-alt"
                                                        style="
                                                          mso-line-height: exactly;
                                                          line-height: 20px;
                                                          letter-spacing: -0.2px;
                                                          font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                          font-size: 18px;
                                                          font-weight: normal;
                                                          color: #d8d8d8;
                                                        "
                                                      >
                                                        Email:
                                                        <a
                                                          class="pc-font-alt"
                                                          style="
                                                            text-decoration: none;
                                                            line-height: 24px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                            font-size: 18px;
                                                            font-weight: 500;
                                                            color: #fe7e00;
                                                          "
                                                          href="mailto:hello@eatnourisha.com"
                                                          >hello@eatnourisha.com</a
                                                        >
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </th>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </th>
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
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- Fix for Gmail on iOS -->
  <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0">
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  </div>
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

export async function sendWelcomeEmail(email: string, payload: any, isTesting: boolean) {
  const subject = `Welcome to Nourisha`;

  const body = `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Application Denied</title>
    <style>
        @media all {

            /* cyrillic-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 100;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjEYTLVdlTOr0s.woff2) format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
                    U+A640-A69F, U+FE2E-FE2F;
            }

            /* cyrillic */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 100;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjNYTLVdlTOr0s.woff2) format("woff2");
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }

            /* latin-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 100;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjHYTLVdlTOr0s.woff2) format("woff2");
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }

            /* latin */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 100;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjJYTLVdlTO.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                    U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                    U+2212, U+2215, U+FEFF, U+FFFD;
            }

            /* cyrillic-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local("Fira Sans Light"), local("FiraSans-Light"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreSxf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
                    U+A640-A69F, U+FE2E-FE2F;
            }

            /* cyrillic */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local("Fira Sans Light"), local("FiraSans-Light"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreQhf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }

            /* latin-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local("Fira Sans Light"), local("FiraSans-Light"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreSBf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }

            /* latin */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local("Fira Sans Light"), local("FiraSans-Light"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreRhf6Xl7Glw.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                    U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                    U+2212, U+2215, U+FEFF, U+FFFD;
            }

            /* cyrillic-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 400;
                src: local("Fira Sans Regular"), local("FiraSans-Regular"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
                    U+A640-A69F, U+FE2E-FE2F;
            }

            /* cyrillic */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 400;
                src: local("Fira Sans Regular"), local("FiraSans-Regular"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format("woff2");
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }

            /* latin-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 400;
                src: local("Fira Sans Regular"), local("FiraSans-Regular"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format("woff2");
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }

            /* latin */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 400;
                src: local("Fira Sans Regular"), local("FiraSans-Regular"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                    U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                    U+2212, U+2215, U+FEFF, U+FFFD;
            }

            /* cyrillic-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 500;
                src: local("Fira Sans Medium"), local("FiraSans-Medium"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSxf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
                    U+A640-A69F, U+FE2E-FE2F;
            }

            /* cyrillic */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 500;
                src: local("Fira Sans Medium"), local("FiraSans-Medium"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }

            /* latin-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 500;
                src: local("Fira Sans Medium"), local("FiraSans-Medium"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSBf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }

            /* latin */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 500;
                src: local("Fira Sans Medium"), local("FiraSans-Medium"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                    U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                    U+2212, U+2215, U+FEFF, U+FFFD;
            }

            /* cyrillic-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 700;
                src: local("Fira Sans Bold"), local("FiraSans-Bold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSxf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
                    U+A640-A69F, U+FE2E-FE2F;
            }

            /* cyrillic */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 700;
                src: local("Fira Sans Bold"), local("FiraSans-Bold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }

            /* latin-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 700;
                src: local("Fira Sans Bold"), local("FiraSans-Bold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSBf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }

            /* latin */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 700;
                src: local("Fira Sans Bold"), local("FiraSans-Bold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format("woff2");
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                    U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                    U+2212, U+2215, U+FEFF, U+FFFD;
            }

            /* cyrillic-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 800;
                font-display: swap;
                src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSxf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF,
                    U+A640-A69F, U+FE2E-FE2F;
            }

            /* cyrillic */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 800;
                font-display: swap;
                src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }

            /* latin-ext */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 800;
                font-display: swap;
                src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSBf6Xl7Gl3LX.woff2) format("woff2");
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }

            /* latin */
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 800;
                font-display: swap;
                src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
                    url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format("woff2");
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

        #outlook a {
            padding: 0;
        }

        .ReadMsgBody,
        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
            line-height: 100%;
        }

        div[style*="margin: 14px 0"],
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        table,
        td,
        th {
            mso-table-lspace: 0 !important;
            mso-table-rspace: 0 !important;
            border-collapse: collapse;
        }

        body,
        td,
        th,
        p,
        div,
        li,
        a,
        span {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            mso-line-height-rule: exactly;
        }

        img {
            border: 0;
            outline: none;
            line-height: 100%;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
        }

        .pc-gmail-fix {
            display: none;
            display: none !important;
        }
    </style>
    <style>
        @media (max-width: 620px) {
            .pc-project-body {
                min-width: 0px !important;
            }

            .pc-project-container {
                width: 100% !important;
            }

            table.pc-w620-spacing-0-10-0-0 {
                margin: 0px 10px 0px 0px !important;
            }

            td.pc-w620-spacing-0-10-0-0,
            th.pc-w620-spacing-0-10-0-0 {
                margin: 0 !important;
                padding: 0px 10px 0px 0px !important;
            }

            .pc-w620-padding-30-30-30-30 {
                padding: 30px 30px 30px 30px !important;
            }

            .pc-w620-view-vertical,
            .pc-w620-view-vertical>tbody,
            .pc-w620-view-vertical>tbody>tr,
            .pc-w620-view-vertical>tbody>tr>th,
            .pc-w620-view-vertical>tr,
            .pc-w620-view-vertical>tr>th {
                display: block !important;
                width: 100% !important;
            }

            table.pc-w620-spacing-15-0-0-0 {
                margin: 15px 0px 0px 0px !important;
            }

            td.pc-w620-spacing-15-0-0-0,
            th.pc-w620-spacing-15-0-0-0 {
                margin: 0 !important;
                padding: 15px 0px 0px 0px !important;
            }

            .pc-w620-padding-0-0-30-0 {
                padding: 0px 0px 30px 0px !important;
            }

            .pc-w620-padding-45-35-45-35 {
                padding: 45px 35px 45px 35px !important;
            }

            table.pc-w620-spacing-0-0-22-0 {
                margin: 0px 0px 22px 0px !important;
            }

            td.pc-w620-spacing-0-0-22-0,
            th.pc-w620-spacing-0-0-22-0 {
                margin: 0 !important;
                padding: 0px 0px 22px 0px !important;
            }

            table.pc-w620-spacing-0-0-25-0 {
                margin: 0px 0px 25px 0px !important;
            }

            td.pc-w620-spacing-0-0-25-0,
            th.pc-w620-spacing-0-0-25-0 {
                margin: 0 !important;
                padding: 0px 0px 25px 0px !important;
            }

            .pc-w620-padding-15-15-15-15 {
                padding: 15px 15px 15px 15px !important;
            }
        }

        @media (max-width: 520px) {
            .pc-w520-padding-25-25-25-25 {
                padding: 25px 25px 25px 25px !important;
            }

            .pc-w520-padding-40-30-40-30 {
                padding: 40px 30px 40px 30px !important;
            }

            .pc-w520-padding-10-10-10-10 {
                padding: 10px 10px 10px 10px !important;
            }
        }
    </style>
    <style>
        @media screen {
            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 400;
                src: url("https://fonts.gstatic.com/s/firasans/v16/va9E4kDNxMZdWfMOD5VvmYjN.woff") format("woff"),
                    url("https://fonts.gstatic.com/s/firasans/v16/va9E4kDNxMZdWfMOD5VvmYjL.woff2") format("woff2");
            }

            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 500;
                src: url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnZKveSBf8.woff") format("woff"),
                    url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnZKveSBf6.woff2") format("woff2");
            }

            @font-face {
                font-family: "Fira Sans";
                font-style: normal;
                font-weight: 700;
                src: url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnLK3eSBf8.woff") format("woff"),
                    url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnLK3eSBf6.woff2") format("woff2");
            }
        }
    </style>
    <!--[if mso]>
      <style type="text/css">
        .pc-font-alt {
          font-family: Helvetica, Arial, sans-serif !important;
        }
      </style>
    <![endif]-->
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
</head>

<body class="pc-font-alt" style="
      width: 100% !important;
      min-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #2d3a41;
      mso-line-height-rule: exactly;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-variant-ligatures: none;
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f4f4f4;
    ">
    <table class="pc-project-body" style="table-layout: fixed; min-width: 600px" width="100%" border="0" cellspacing="0"
        cellpadding="0" role="presentation">
        <tr>
            <td align="center" valign="top" bgcolor="#f4f4f4">
                <table class="pc-project-container" style="width: 720px; max-width: 720px" width="600" align="center"
                    border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td style="padding: 20px 0px 20px 0px" align="left" valign="top">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td style="padding: 0px 0px 0px 0px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                            role="presentation">
                                            <tr>
                                                <td valign="top"
                                                    class="pc-w520-padding-25-25-25-25 pc-w620-padding-30-30-30-30"
                                                    style="
                              padding: 36px 40px 36px 40px;
                              border-radius: 0px;
                              background-color: #220f01;
                            " bgcolor="#220f01">
                                                    <table class="image-block" width="100%" border="0" cellpadding="0"
                                                        cellspacing="0" role="presentation">
                                                        <tr class="image-block-tr">
                                                            <td class="image-block-td" align="center" valign="top">
                                                                <a class="pc-font-alt" style="text-decoration: none"
                                                                    href="https://rapydcars.com">
                                                                    <img src="https://res.cloudinary.com/drivfk4v3/image/upload/v1688489961/Nourisha/full-logo_pzmxnm.png"
                                                                        width="129" height="42" style="
                                        border: 0;
                                        outline: 0;
                                        line-height: 100%;
                                        -ms-interpolation-mode: bicubic;
                                        width: 129px;
                                        max-width: 100%;
                                        height: auto;
                                      " alt="" />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td style="padding: 0px 0px 0px 0px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                            role="presentation">
                                            <tr>
                                                <td valign="top"
                                                    class="pc-w520-padding-40-30-40-30 pc-w620-padding-45-35-45-35"
                                                    style="
                              padding: 50px 40px 50px 40px;
                              border-radius: 0px;
                              background-color: #ffffff;
                            " bgcolor="#ffffff">
                                                    <table class="list" width="100%" border="0" cellpadding="0"
                                                        cellspacing="0" role="presentation">
                                                        <tr class="list-tr">
                                                            <td class="list-td" valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation"
                                                                    class="list-horizontal pc-w620-view-vertical">
                                                                    <tr class="list-horizontal-tr">
                                                                        <th class="text-block-container-td" valign="top"
                                                                            style="
                                          font-weight: normal;
                                          text-align: left;
                                          padding: 0px 0px 0px 0px;
                                        ">
                                                                            <table class="text-block" border="0"
                                                                                cellpadding="0" role="presentation"
                                                                                width="100%">
                                                                                <tr class="text-block-tr">
                                                                                    <td valign="top"
                                                                                        class="text-block-td pc-font-alt"
                                                                                        style="
                                                mso-line-height: exactly;
                                                line-height: 34px;
                                                letter-spacing: -0.4px;
                                                font-family: 'Fira Sans',
                                                  Helvetica, Arial, sans-serif;
                                                font-size: 24px;
                                                font-weight: bold;
                                                color: #151515;
                                              ">
                                                                                        Hello ${payload?.name},
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </th>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td style="line-height: 1px; font-size: 1px" height="13">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="text-block-wrapper" width="100%" border="0"
                                                        cellpadding="0" cellspacing="0" role="presentation">
                                                        <tr>
                                                            <td class="text-block-wrapper-td"
                                                                style="padding: 0px 0px 40px 0px" valign="top">
                                                                <table class="text-block" border="0" cellpadding="0"
                                                                    role="presentation" width="100%">
                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 8px 0px 0px 0px;
                                        ">
                                                                            <span>Welcome to Nourisha, </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 8px 0px 0px 0px;
                                        ">
                                                                            <span>You're about to get lost in our
                                                                                recipes! Nourisha caters to your food
                                                                                needs. We take care of all the added
                                                                                extras, from cooking to delivering to
                                                                                your doorstep and so much more!
                                                                            </span>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td style="
                                          padding: 0px 0px 20px 0px !important;
                                        "></td>
                                                                    </tr>
                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: 500;
                                          color: black;
                                          padding: 8px 0px 0px 0px;
                                        ">
                                                                            <span>Tips to get started:</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 16px 0px 0px 0px;
                                        ">
                                                                            <span>- &nbsp;Subscribe to a plan: Choose
                                                                                whether you want our weekly or monthly
                                                                                plan. Whichever one you decide on, we
                                                                                want you to know that we will exceed
                                                                                your expectations in terms of
                                                                                delivery.</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 16px 0px 0px 0px;
                                        ">
                                                                            <span>- &nbsp;Plan and book your meals for
                                                                                the week ahead: Because we are focused
                                                                                on serving you better, we take the
                                                                                time to prepare your meals. You can
                                                                                only plan your meals for the week
                                                                                ahead.</span>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td style="
                                          padding: 0px 0px 20px 0px !important;
                                        "></td>
                                                                    </tr>

                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: 500;
                                          color: black;
                                          padding: 8px 0px 0px 0px;
                                        ">
                                                                            <span>Invite your friends:</span>
                                                                        </td>
                                                                    </tr>

                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 16px 0px 0px 0px;
                                        ">
                                                                            <span>Right now, you probably know someone
                                                                                who is looking to budget their
                                                                                spending, so why not let them know
                                                                                about Nourisha? Nourisha is better
                                                                                with friends. Share your invite code
                                                                                with them!
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr class="text-block-tr">
                                                                        <td valign="top"
                                                                            class="text-block-td pc-font-alt" style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica,
                                            Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 16px 0px 0px 0px;
                                        ">
                                                                            <span>For every friend you invite, we'll
                                                                                give you £10. They just need to sign
                                                                                up and plan their meals with Nourisha.
                                                                            </span>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td style="
                                          padding: 0px 0px 40px 0px !important;
                                        "></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table class="list" width="100%" border="0" cellpadding="0"
                                                        cellspacing="0" role="presentation">
                                                        <tr class="list-tr">
                                                            <td class="list-td" valign="top"
                                                                style="border-radius: 0px 0px 0px 0px">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation" width="100%"
                                                                    class="list-horizontal pc-w620-view-vertical">
                                                                    <tr class="list-horizontal-tr">
                                                                        <th valign="top" width="50%" style="
                                          font-weight: normal;
                                          text-align: left;
                                          width: 50%;
                                        "></th>
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
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td style="padding: 0px 0px 0px 0px">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                            role="presentation">
                                            <tr>
                                                <td valign="top"
                                                    class="pc-w520-padding-10-10-10-10 pc-w620-padding-15-15-15-15"
                                                    style="
                              padding: 20px 20px 20px 20px;
                              border-radius: 0px;
                              background-color: #220f01;
                            " bgcolor="#220f01">
                                                    <table class="list" width="100%" border="0" cellpadding="0"
                                                        cellspacing="0" role="presentation">
                                                        <tr class="list-tr">
                                                            <td class="list-td" valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation" width="100%"
                                                                    class="list-horizontal pc-w620-view-vertical">
                                                                    <tr class="list-horizontal-tr">
                                                                        <th class="card-container-td" width="50%"
                                                                            valign="top" style="
                                          font-weight: normal;
                                          text-align: left;
                                          width: 50%;
                                        ">
                                                                            <table class="card" border="0"
                                                                                cellpadding="0" cellspacing="0"
                                                                                role="presentation" width="100%">
                                                                                <tr class="card-tr">
                                                                                    <td valign="top" class="card-td"
                                                                                        style="
                                                padding: 20px 20px 20px 20px;
                                              ">
                                                                                        <table class="card-inner"
                                                                                            width="100%" border="0"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            role="presentation">
                                                                                            <tr>
                                                                                                <th class="text-block-container-td"
                                                                                                    valign="top" style="
                                                      font-weight: normal;
                                                      text-align: left;
                                                      padding: 0px 0px 10px 0px;
                                                    ">
                                                                                                    <table
                                                                                                        class="text-block"
                                                                                                        border="0"
                                                                                                        cellpadding="0"
                                                                                                        role="presentation"
                                                                                                        width="100%">
                                                                                                        <tr
                                                                                                            class="text-block-tr">
                                                                                                            <td valign="top"
                                                                                                                class="text-block-td pc-font-alt"
                                                                                                                style="
                                                            mso-line-height: exactly;
                                                            line-height: 24px;
                                                            font-family: 'Fira Sans',
                                                              Helvetica, Arial,
                                                              sans-serif;
                                                            font-size: 18px;
                                                            font-weight: 500;
                                                            color: #ffffff;
                                                          ">
                                                                                                                Follow
                                                                                                                Us.
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </th>
                                                                                            </tr>

                                                                                            <tr>
                                                                                                <th valign="top" style="
                                                      font-weight: normal;
                                                      text-align: left;
                                                    ">
                                                                                                    <table class="list"
                                                                                                        width="100%"
                                                                                                        border="0"
                                                                                                        cellpadding="0"
                                                                                                        cellspacing="0"
                                                                                                        role="presentation">
                                                                                                        <tr
                                                                                                            class="list-tr">
                                                                                                            <td class="list-td"
                                                                                                                valign="top">
                                                                                                                <table
                                                                                                                    border="0"
                                                                                                                    cellpadding="0"
                                                                                                                    cellspacing="0"
                                                                                                                    role="presentation"
                                                                                                                    class="list-horizontal">
                                                                                                                    <tr
                                                                                                                        class="list-horizontal-tr">
                                                                                                                        <th valign="top"
                                                                                                                            style="
                                                                  font-weight: normal;
                                                                  text-align: left;
                                                                ">
                                                                                                                            <table
                                                                                                                                class="image-block"
                                                                                                                                width="100%"
                                                                                                                                border="0"
                                                                                                                                cellpadding="0"
                                                                                                                                cellspacing="0"
                                                                                                                                role="presentation">
                                                                                                                                <tr
                                                                                                                                    class="image-block-tr">
                                                                                                                                    <td class="image-block-td"
                                                                                                                                        valign="top"
                                                                                                                                        style="
                                                                        padding: 0px
                                                                          20px
                                                                          0px
                                                                          0px;
                                                                      ">
                                                                                                                                        <a class="pc-font-alt"
                                                                                                                                            style="
                                                                          text-decoration: none;
                                                                        " href="https://www.facebook.com/people/Eatnourisha/100068259570536/?mibextid=LQQJ4d&_rdc=1&_rdr">
                                                                                                                                            <img src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/facebook-white_zniyn5.png"
                                                                                                                                                width="20"
                                                                                                                                                height="19"
                                                                                                                                                style="
                                                                            border: 0;
                                                                            outline: 0;
                                                                            line-height: 100%;
                                                                            -ms-interpolation-mode: bicubic;
                                                                            width: 20px;
                                                                            max-width: 100%;
                                                                            height: auto;
                                                                          " alt="" />
                                                                                                                                        </a>
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            </table>
                                                                                                                        </th>
                                                                                                                        <th valign="top"
                                                                                                                            style="
                                                                  font-weight: normal;
                                                                  text-align: left;
                                                                ">
                                                                                                                            <table
                                                                                                                                class="image-block"
                                                                                                                                width="100%"
                                                                                                                                border="0"
                                                                                                                                cellpadding="0"
                                                                                                                                cellspacing="0"
                                                                                                                                role="presentation">
                                                                                                                                <tr
                                                                                                                                    class="image-block-tr">
                                                                                                                                    <td class="image-block-td"
                                                                                                                                        valign="top"
                                                                                                                                        style="
                                                                        padding: 0px
                                                                          20px
                                                                          0px
                                                                          0px;
                                                                      ">
                                                                                                                                        <a class="pc-font-alt"
                                                                                                                                            style="
                                                                          text-decoration: none;
                                                                        " href="https://twitter.com/nourisha12/status/1652961343736086529?s=46">
                                                                                                                                            <img src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/twitter-white_k7lk4y.png"
                                                                                                                                                width="22"
                                                                                                                                                height="17"
                                                                                                                                                style="
                                                                            border: 0;
                                                                            outline: 0;
                                                                            line-height: 100%;
                                                                            -ms-interpolation-mode: bicubic;
                                                                            width: 22px;
                                                                            max-width: 100%;
                                                                            height: auto;
                                                                          " alt="" />
                                                                                                                                        </a>
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            </table>
                                                                                                                        </th>
                                                                                                                        <th valign="top"
                                                                                                                            style="
                                                                  font-weight: normal;
                                                                  text-align: left;
                                                                ">
                                                                                                                            <table
                                                                                                                                class="image-block"
                                                                                                                                width="100%"
                                                                                                                                border="0"
                                                                                                                                cellpadding="0"
                                                                                                                                cellspacing="0"
                                                                                                                                role="presentation">
                                                                                                                                <tr
                                                                                                                                    class="image-block-tr">
                                                                                                                                    <td class="image-block-td"
                                                                                                                                        valign="top"
                                                                                                                                        style="
                                                                        padding: 0px
                                                                          20px
                                                                          0px
                                                                          0px;
                                                                      ">
                                                                                                                                        <a class="pc-font-alt"
                                                                                                                                            style="
                                                                          text-decoration: none;
                                                                        " href="https://www.instagram.com/eatnourisha/?igshid=MmJiY2I4NDBkZg%3D%3D">
                                                                                                                                            <img src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/instagram-white_pp0hj4.png"
                                                                                                                                                width="20"
                                                                                                                                                height="20"
                                                                                                                                                style="
                                                                            border: 0;
                                                                            outline: 0;
                                                                            line-height: 100%;
                                                                            -ms-interpolation-mode: bicubic;
                                                                            width: 20px;
                                                                            max-width: 100%;
                                                                            height: auto;
                                                                          " alt="" />
                                                                                                                                        </a>
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            </table>
                                                                                                                        </th>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>
                                                                                                    <div><br /></div>
                                                                                                    <div><br /></div>
                                                                                                    <div><br /></div>
                                                                                                    <div><br /></div>
                                                                                                    <div><br /></div>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th class="text-block-container-td"
                                                                                                    valign="top" style="
                                                      font-weight: normal;
                                                      text-align: left;
                                                      padding: 0px 0px 12px 0px;
                                                    ">
                                                                                                    <table
                                                                                                        class="text-block"
                                                                                                        border="0"
                                                                                                        cellpadding="0"
                                                                                                        role="presentation"
                                                                                                        width="100%">
                                                                                                        <tr
                                                                                                            class="text-block-tr">
                                                                                                            <td valign="top"
                                                                                                                class="text-block-td pc-font-alt"
                                                                                                                style="
                                                            mso-line-height: exactly;
                                                            line-height: 20px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans',
                                                              Helvetica, Arial,
                                                              sans-serif;
                                                            font-size: 14px;
                                                            font-weight: 600;
                                                            color: white;
                                                            padding: 0px 0px 0px
                                                              0px !important;
                                                          ">
                                                                                                                ©2023
                                                                                                                Nourisha&nbsp;
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </th>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </th>
                                                                        <th class="card-container-td" width="50%"
                                                                            valign="top" style="
                                          font-weight: normal;
                                          text-align: left;
                                          width: 50%;
                                        ">
                                                                            <table class="card" border="0"
                                                                                cellpadding="0" cellspacing="0"
                                                                                role="presentation" width="100%">
                                                                                <tr class="card-tr">
                                                                                    <td valign="top" class="card-td"
                                                                                        style="
                                                padding: 20px 20px 20px 20px;
                                              ">
                                                                                        <table class="card-inner"
                                                                                            width="100%" border="0"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            role="presentation">
                                                                                            <tr>
                                                                                                <th class="text-block-container-td"
                                                                                                    valign="top" style="
                                                      font-weight: normal;
                                                      text-align: left;
                                                      padding: 0px 0px 10px 0px;
                                                    ">
                                                                                                    <table
                                                                                                        class="text-block"
                                                                                                        border="0"
                                                                                                        cellpadding="0"
                                                                                                        role="presentation"
                                                                                                        width="100%">
                                                                                                        <tr
                                                                                                            class="text-block-tr">
                                                                                                            <td valign="top"
                                                                                                                class="text-block-td pc-font-alt"
                                                                                                                style="
                                                            mso-line-height: exactly;
                                                            line-height: 24px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans',
                                                              Helvetica, Arial,
                                                              sans-serif;
                                                            font-size: 18px;
                                                            font-weight: 500;
                                                            color: #ffffff;
                                                          ">
                                                                                                                Contact
                                                                                                                us
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th class="text-block-container-td pc-w620-spacing-0-0-25-0"
                                                                                                    valign="top" style="
                                                      font-weight: normal;
                                                      text-align: left;
                                                      padding: 0px 0px 45px 0px;
                                                    ">
                                                                                                    <table
                                                                                                        class="text-block"
                                                                                                        border="0"
                                                                                                        cellpadding="0"
                                                                                                        role="presentation"
                                                                                                        width="100%">
                                                                                                        <tr
                                                                                                            class="text-block-tr">
                                                                                                            <td valign="top"
                                                                                                                class="text-block-td pc-font-alt"
                                                                                                                style="
                                                            mso-line-height: exactly;
                                                            line-height: 20px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans',
                                                              Helvetica, Arial,
                                                              sans-serif;
                                                            font-size: 18px;
                                                            font-weight: normal;
                                                            color: #d8d8d8;
                                                          ">
                                                                                                                Email:
                                                                                                                <a class="pc-font-alt"
                                                                                                                    style="
                                                              text-decoration: none;
                                                              line-height: 24px;
                                                              letter-spacing: -0.2px;
                                                              font-family: 'Fira Sans',
                                                                Helvetica, Arial,
                                                                sans-serif;
                                                              font-size: 18px;
                                                              font-weight: 500;
                                                              color: #fe7e00;
                                                            " href="mailto:hello@eatnourisha.com">hello@eatnourisha.com</a>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </th>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </th>
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
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!-- Fix for Gmail on iOS -->
    <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0">
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>
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

export async function sendOrderPlacedEmail(email: string, payload: any, isTesting: boolean) {
  const subject = `🥳 Order successfully placed`

  const body = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Application Denied</title>
    <style>
      @media all {
        /* cyrillic-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 100;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjEYTLVdlTOr0s.woff2) format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 100;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjNYTLVdlTOr0s.woff2) format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 100;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjHYTLVdlTOr0s.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 100;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/firasans/v11/va9C4kDNxMZdWfMOD5Vn9LjJYTLVdlTO.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: local("Fira Sans Light"), local("FiraSans-Light"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreSxf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: local("Fira Sans Light"), local("FiraSans-Light"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreQhf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: local("Fira Sans Light"), local("FiraSans-Light"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreSBf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: local("Fira Sans Light"), local("FiraSans-Light"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKreRhf6Xl7Glw.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 400;
          src: local("Fira Sans Regular"), local("FiraSans-Regular"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 400;
          src: local("Fira Sans Regular"), local("FiraSans-Regular"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 400;
          src: local("Fira Sans Regular"), local("FiraSans-Regular"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 400;
          src: local("Fira Sans Regular"), local("FiraSans-Regular"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 500;
          src: local("Fira Sans Medium"), local("FiraSans-Medium"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSxf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 500;
          src: local("Fira Sans Medium"), local("FiraSans-Medium"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 500;
          src: local("Fira Sans Medium"), local("FiraSans-Medium"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveSBf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 500;
          src: local("Fira Sans Medium"), local("FiraSans-Medium"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 700;
          src: local("Fira Sans Bold"), local("FiraSans-Bold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSxf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 700;
          src: local("Fira Sans Bold"), local("FiraSans-Bold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 700;
          src: local("Fira Sans Bold"), local("FiraSans-Bold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eSBf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 700;
          src: local("Fira Sans Bold"), local("FiraSans-Bold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

        /* cyrillic-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSxf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
        }

        /* cyrillic */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
        }

        /* latin-ext */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eSBf6Xl7Gl3LX.woff2) format("woff2");
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
        }

        /* latin */
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local("Fira Sans ExtraBold"), local("FiraSans-ExtraBold"),
            url(https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format("woff2");
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
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

      #outlook a {
        padding: 0;
      }

      .ReadMsgBody,
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass td,
      .ExternalClass div,
      .ExternalClass span,
      .ExternalClass font {
        line-height: 100%;
      }

      div[style*="margin: 14px 0"],
      div[style*="margin: 16px 0"] {
        margin: 0 !important;
      }

      table,
      td,
      th {
        mso-table-lspace: 0 !important;
        mso-table-rspace: 0 !important;
        border-collapse: collapse;
      }

      body,
      td,
      th,
      p,
      div,
      li,
      a,
      span {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        mso-line-height-rule: exactly;
      }

      img {
        border: 0;
        outline: none;
        line-height: 100%;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
      }

      .pc-gmail-fix {
        display: none;
        display: none !important;
      }
    </style>
    <style>
      @media (max-width: 620px) {
        .pc-project-body {
          min-width: 0px !important;
        }

        .pc-project-container {
          width: 100% !important;
        }

        table.pc-w620-spacing-0-10-0-0 {
          margin: 0px 10px 0px 0px !important;
        }

        td.pc-w620-spacing-0-10-0-0,
        th.pc-w620-spacing-0-10-0-0 {
          margin: 0 !important;
          padding: 0px 10px 0px 0px !important;
        }

        .pc-w620-padding-30-30-30-30 {
          padding: 30px 30px 30px 30px !important;
        }

        .pc-w620-view-vertical,
        .pc-w620-view-vertical > tbody,
        .pc-w620-view-vertical > tbody > tr,
        .pc-w620-view-vertical > tbody > tr > th,
        .pc-w620-view-vertical > tr,
        .pc-w620-view-vertical > tr > th {
          display: block !important;
          width: 100% !important;
        }

        table.pc-w620-spacing-15-0-0-0 {
          margin: 15px 0px 0px 0px !important;
        }

        td.pc-w620-spacing-15-0-0-0,
        th.pc-w620-spacing-15-0-0-0 {
          margin: 0 !important;
          padding: 15px 0px 0px 0px !important;
        }

        .pc-w620-padding-0-0-30-0 {
          padding: 0px 0px 30px 0px !important;
        }

        .pc-w620-padding-45-35-45-35 {
          padding: 45px 35px 45px 35px !important;
        }

        table.pc-w620-spacing-0-0-22-0 {
          margin: 0px 0px 22px 0px !important;
        }

        td.pc-w620-spacing-0-0-22-0,
        th.pc-w620-spacing-0-0-22-0 {
          margin: 0 !important;
          padding: 0px 0px 22px 0px !important;
        }

        table.pc-w620-spacing-0-0-25-0 {
          margin: 0px 0px 25px 0px !important;
        }

        td.pc-w620-spacing-0-0-25-0,
        th.pc-w620-spacing-0-0-25-0 {
          margin: 0 !important;
          padding: 0px 0px 25px 0px !important;
        }

        .pc-w620-padding-15-15-15-15 {
          padding: 15px 15px 15px 15px !important;
        }
      }

      @media (max-width: 520px) {
        .pc-w520-padding-25-25-25-25 {
          padding: 25px 25px 25px 25px !important;
        }

        .pc-w520-padding-40-30-40-30 {
          padding: 40px 30px 40px 30px !important;
        }

        .pc-w520-padding-10-10-10-10 {
          padding: 10px 10px 10px 10px !important;
        }
      }
    </style>
    <style>
      @media screen {
        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 400;
          src: url("https://fonts.gstatic.com/s/firasans/v16/va9E4kDNxMZdWfMOD5VvmYjN.woff") format("woff"),
            url("https://fonts.gstatic.com/s/firasans/v16/va9E4kDNxMZdWfMOD5VvmYjL.woff2") format("woff2");
        }

        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 500;
          src: url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnZKveSBf8.woff") format("woff"),
            url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnZKveSBf6.woff2") format("woff2");
        }

        @font-face {
          font-family: "Fira Sans";
          font-style: normal;
          font-weight: 700;
          src: url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnLK3eSBf8.woff") format("woff"),
            url("https://fonts.gstatic.com/s/firasans/v16/va9B4kDNxMZdWfMOD5VnLK3eSBf6.woff2") format("woff2");
        }
      }
    </style>
    <!--[if mso]>
      <style type="text/css">
        .pc-font-alt {
          font-family: Helvetica, Arial, sans-serif !important;
        }
      </style>
    <![endif]-->
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
  </head>

  <body
    class="pc-font-alt"
    style="
      width: 100% !important;
      min-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #2d3a41;
      mso-line-height-rule: exactly;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-variant-ligatures: none;
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f4f4f4;
    "
  >
    <table
      class="pc-project-body"
      style="table-layout: fixed; min-width: 600px"
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      role="presentation"
    >
      <tr>
        <td align="center" valign="top" bgcolor="#f4f4f4">
          <table
            class="pc-project-container"
            style="width: 720px; max-width: 720px"
            width="600"
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
          >
            <tr>
              <td style="padding: 20px 0px 20px 0px" align="left" valign="top">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                    <td style="padding: 0px 0px 0px 0px">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                          <td
                            valign="top"
                            class="pc-w520-padding-25-25-25-25 pc-w620-padding-30-30-30-30"
                            style="padding: 36px 40px 36px 40px; border-radius: 0px; background-color: #220f01"
                            bgcolor="#220f01"
                          >
                            <table class="image-block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr class="image-block-tr">
                                <td class="image-block-td" align="center" valign="top">
                                  <a class="pc-font-alt" style="text-decoration: none" href="https://rapydcars.com">
                                    <img
                                      src="https://res.cloudinary.com/drivfk4v3/image/upload/v1688489961/Nourisha/full-logo_pzmxnm.png"
                                      width="129"
                                      height="42"
                                      style="
                                        border: 0;
                                        outline: 0;
                                        line-height: 100%;
                                        -ms-interpolation-mode: bicubic;
                                        width: 129px;
                                        max-width: 100%;
                                        height: auto;
                                      "
                                      alt=""
                                    />
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                    <td style="padding: 0px 0px 0px 0px">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                          <td
                            valign="top"
                            class="pc-w520-padding-40-30-40-30 pc-w620-padding-45-35-45-35"
                            style="padding: 50px 40px 50px 40px; border-radius: 0px; background-color: #ffffff"
                            bgcolor="#ffffff"
                          >
                            <table class="list" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr class="list-tr">
                                <td class="list-td" valign="top">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    class="list-horizontal pc-w620-view-vertical"
                                  >
                                    <tr class="list-horizontal-tr">
                                      <th
                                        class="text-block-container-td"
                                        valign="top"
                                        style="font-weight: normal; text-align: left; padding: 0px 0px 0px 0px"
                                      >
                                        <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                          <tr class="text-block-tr">
                                            <td
                                              valign="top"
                                              class="text-block-td pc-font-alt"
                                              style="
                                                mso-line-height: exactly;
                                                line-height: 34px;
                                                letter-spacing: -0.4px;
                                                font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                font-size: 24px;
                                                font-weight: bold;
                                                color: #151515;
                                              "
                                            >
                                              Dear ${payload.name},
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td style="line-height: 1px; font-size: 1px" height="13">&nbsp;</td>
                              </tr>
                            </table>
                            <table class="text-block-wrapper" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td class="text-block-wrapper-td" style="padding: 0px 0px 40px 0px" valign="top">
                                  <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                    <tr class="text-block-tr">
                                      <td
                                        valign="top"
                                        class="text-block-td pc-font-alt"
                                        style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 16px 0px 0px 0px;
                                        "
                                      >
                                        <!-- email content -->
                                        <span
                                          >Thank you for choosing Nourisha!<br />
                                          We're thrilled to confirm your recent order. Here are the details of your mouthwatering
                                          selections: <br /></span
                                        ><br />

                                        <div>
                                          <div style="margin: 0 4px; font-size: 15px; font-weight: 500">
                                            Order Reference ID:
                                            <span style="font-weight: 600; margin-left: 10px">${payload?.order_ref_id}</span>
                                          </div>
                                          <div style="margin: 0px 4px; font-size: 15px; font-weight: 500">
                                            Delivery Date:
                                            <span style="font-weight: 600; margin-left: 10px">${payload?.delivery_date}</span>
                                          </div>
                                          <div style="margin: 0 4px; font-size: 15px; font-weight: 500">
                                            Delivery Address:
                                            <span style="font-weight: 600; margin-left: 10px">${payload?.delivery_address}</span>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>

                                    <tr class="text-block-tr">
                                      <td
                                        valign="top"
                                        class="text-block-td pc-font-alt"
                                        style="
                                          mso-line-height: exactly;
                                          line-height: 28px;
                                          letter-spacing: -0.2px;
                                          font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                          font-size: 18px;
                                          font-weight: normal;
                                          color: #5c5c5c;
                                          padding: 16px 0px 0px 0px;
                                        "
                                      >
                                        <!-- email content -->
                                        <span
                                          >Your delectable dishes are now in the works and will be prepared for you. You will receive an
                                          email from our delivery partner once your order is out for delivery. <br /></span
                                        ><br />
                                        <span
                                          >If you have any questions or concerns, feel free to contact our customer support at
                                          <a style="color: #fe7e00" href="mail:hello@eatnourisha.com">hello@eatnourisha.com</a>
                                          or
                                          <a style="color: #fe7e00" href="tel:02080583407">02080583407</a>

                                          <br /></span
                                        ><br />

                                        <span>Thank you for choosing Nourisha! We hope you enjoy every bite.<br /></span><br />
                                        <span>Bon appétit!<br /></span>
                                        <span>Best regards,<br /></span>
                                        <span>Nourisha,<br /></span><br />
                                      </td>
                                    </tr>

                                    <tr>
                                      <td style="padding: 0px 0px 0px 0px !important"></td>
                                    </tr>
                                    <!-- <tr>
                                      <td>
                                        <a
                                          href="{${payload?.link}}"
                                          style="
                                            mso-line-height: exactly;
                                            line-height: 28px;
                                            letter-spacing: -0.2px;
                                            font-family: 'Fira Sans', Helvetica,
                                              Arial, sans-serif;
                                            font-size: 16px;
                                            font-weight: 500;
                                            color: white;
                                            background: #fe7e00;
                                            padding: 10px 40px 10px 40px !important;
                                            text-decoration: none;
                                            border-radius: 8px;
                                          "
                                          >Reset Password</a
                                        >
                                      </td>
                                    </tr> -->
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <table class="list" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr class="list-tr">
                                <td class="list-td" valign="top" style="border-radius: 0px 0px 0px 0px">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                    class="list-horizontal pc-w620-view-vertical"
                                  >
                                    <tr class="list-horizontal-tr">
                                      <th valign="top" width="50%" style="font-weight: normal; text-align: left; width: 50%"></th>
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
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                    <td style="padding: 0px 0px 0px 0px">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                          <td
                            valign="top"
                            class="pc-w520-padding-10-10-10-10 pc-w620-padding-15-15-15-15"
                            style="padding: 20px 20px 20px 20px; border-radius: 0px; background-color: #220f01"
                            bgcolor="#220f01"
                          >
                            <table class="list" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr class="list-tr">
                                <td class="list-td" valign="top">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                    class="list-horizontal pc-w620-view-vertical"
                                  >
                                    <tr class="list-horizontal-tr">
                                      <th
                                        class="card-container-td"
                                        width="50%"
                                        valign="top"
                                        style="font-weight: normal; text-align: left; width: 50%"
                                      >
                                        <table class="card" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                          <tr class="card-tr">
                                            <td valign="top" class="card-td" style="padding: 20px 20px 20px 20px">
                                              <table
                                                class="card-inner"
                                                width="100%"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                role="presentation"
                                              >
                                                <tr>
                                                  <th
                                                    class="text-block-container-td"
                                                    valign="top"
                                                    style="font-weight: normal; text-align: left; padding: 0px 0px 10px 0px"
                                                  >
                                                    <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                      <tr class="text-block-tr">
                                                        <td
                                                          valign="top"
                                                          class="text-block-td pc-font-alt"
                                                          style="
                                                            mso-line-height: exactly;
                                                            line-height: 24px;
                                                            font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                            font-size: 18px;
                                                            font-weight: 500;
                                                            color: #ffffff;
                                                          "
                                                        >
                                                          Follow Us.
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>

                                                <tr>
                                                  <th valign="top" style="font-weight: normal; text-align: left">
                                                    <table
                                                      class="list"
                                                      width="100%"
                                                      border="0"
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      role="presentation"
                                                    >
                                                      <tr class="list-tr">
                                                        <td class="list-td" valign="top">
                                                          <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            role="presentation"
                                                            class="list-horizontal"
                                                          >
                                                            <tr class="list-horizontal-tr">
                                                              <th valign="top" style="font-weight: normal; text-align: left">
                                                                <table
                                                                  class="image-block"
                                                                  width="100%"
                                                                  border="0"
                                                                  cellpadding="0"
                                                                  cellspacing="0"
                                                                  role="presentation"
                                                                >
                                                                <tr class="image-block-tr">
                                                                  <td
                                                                    class="image-block-td"
                                                                    valign="top"
                                                                    style="padding: 0px 20px 0px 0px"
                                                                  >
                                                                  
                                                                  </a>
                                                                  <a class="pc-font-alt" style="text-decoration: none" href="https://wa.me/message/BB646ME72KPXE1">
                                                                    <img                   
                                                                    src="https://static-00.iconduck.com/assets.00/whatsapp-icon-2040x2048-8b5th74o.png"
                                                                    width="20"
                                                                    height="19"
                                                                    style="
                                                                      border: 0;
                                                                      outline: 0;
                                                                      line-height: 100%;
                                                                      -ms-interpolation-mode: bicubic;
                                                                      width: 20px;
                                                                      max-width: 100%;
                                                                      height: auto;
                                                                    "
                                                                    alt=""/>
                                                                    </a>
                                                                  </td>
                                                                </tr>
                                                                  <tr class="image-block-tr">
                                                                    <td
                                                                      class="image-block-td"
                                                                      valign="top"
                                                                      style="padding: 0px 20px 0px 0px"
                                                                    >
                                                                    
                                                                    </a>
                                                                      <a
                                                                        class="pc-font-alt"
                                                                        style="text-decoration: none"
                                                                        href="https://www.facebook.com/people/Eatnourisha/100068259570536/?mibextid=LQQJ4d&_rdc=1&_rdr"
                                                                      >
                                                                        <img
                                                                          src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/facebook-white_zniyn5.png"
                                                                          width="20"
                                                                          height="19"
                                                                          style="
                                                                            border: 0;
                                                                            outline: 0;
                                                                            line-height: 100%;
                                                                            -ms-interpolation-mode: bicubic;
                                                                            width: 20px;
                                                                            max-width: 100%;
                                                                            height: auto;
                                                                          "
                                                                          alt=""
                                                                        />
                                                                      </a>
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                              <th valign="top" style="font-weight: normal; text-align: left">
                                                                <table
                                                                  class="image-block"
                                                                  width="100%"
                                                                  border="0"
                                                                  cellpadding="0"
                                                                  cellspacing="0"
                                                                  role="presentation"
                                                                >
                                                                  <tr class="image-block-tr">
                                                                    <td
                                                                      class="image-block-td"
                                                                      valign="top"
                                                                      style="padding: 0px 20px 0px 0px"
                                                                    >
                                                                      <a
                                                                        class="pc-font-alt"
                                                                        style="text-decoration: none"
                                                                        href="https://twitter.com/nourisha12/status/1652961343736086529?s=46"
                                                                      >
                                                                        <img
                                                                          src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/twitter-white_k7lk4y.png"
                                                                          width="22"
                                                                          height="17"
                                                                          style="
                                                                            border: 0;
                                                                            outline: 0;
                                                                            line-height: 100%;
                                                                            -ms-interpolation-mode: bicubic;
                                                                            width: 22px;
                                                                            max-width: 100%;
                                                                            height: auto;
                                                                          "
                                                                          alt=""
                                                                        />
                                                                      </a>
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                              <th valign="top" style="font-weight: normal; text-align: left">
                                                                <table
                                                                  class="image-block"
                                                                  width="100%"
                                                                  border="0"
                                                                  cellpadding="0"
                                                                  cellspacing="0"
                                                                  role="presentation"
                                                                >
                                                                  <tr class="image-block-tr">
                                                                    <td
                                                                      class="image-block-td"
                                                                      valign="top"
                                                                      style="padding: 0px 20px 0px 0px"
                                                                    >
                                                                      <a
                                                                        class="pc-font-alt"
                                                                        style="text-decoration: none"
                                                                        href="https://www.instagram.com/eatnourisha/?igshid=MmJiY2I4NDBkZg%3D%3D"
                                                                      >
                                                                        <img
                                                                          src="https://res.cloudinary.com/rapyd-cars/image/upload/v1656692271/Email%20Assets/instagram-white_pp0hj4.png"
                                                                          width="20"
                                                                          height="20"
                                                                          style="
                                                                            border: 0;
                                                                            outline: 0;
                                                                            line-height: 100%;
                                                                            -ms-interpolation-mode: bicubic;
                                                                            width: 20px;
                                                                            max-width: 100%;
                                                                            height: auto;
                                                                          "
                                                                          alt=""
                                                                        />
                                                                      </a>
                                                                    </td>
                                                                  </tr>
                                                                </table>
                                                              </th>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <div><br /></div>
                                                    <div><br /></div>
                                                    <div><br /></div>
                                                    <div><br /></div>
                                                    <div><br /></div>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <th
                                                    class="text-block-container-td"
                                                    valign="top"
                                                    style="font-weight: normal; text-align: left; padding: 0px 0px 12px 0px"
                                                  >
                                                    <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                      <tr class="text-block-tr">
                                                        <td
                                                          valign="top"
                                                          class="text-block-td pc-font-alt"
                                                          style="
                                                            mso-line-height: exactly;
                                                            line-height: 20px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                            font-size: 14px;
                                                            font-weight: 600;
                                                            color: white;
                                                            padding: 0px 0px 0px 0px !important;
                                                          "
                                                        >
                                                          ©2023 Nourisha&nbsp;
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
                                      <th
                                        class="card-container-td"
                                        width="50%"
                                        valign="top"
                                        style="font-weight: normal; text-align: left; width: 50%"
                                      >
                                        <table class="card" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                          <tr class="card-tr">
                                            <td valign="top" class="card-td" style="padding: 20px 20px 20px 20px">
                                              <table
                                                class="card-inner"
                                                width="100%"
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                role="presentation"
                                              >
                                                <tr>
                                                  <th
                                                    class="text-block-container-td"
                                                    valign="top"
                                                    style="font-weight: normal; text-align: left; padding: 0px 0px 10px 0px"
                                                  >
                                                    <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                      <tr class="text-block-tr">
                                                        <td
                                                          valign="top"
                                                          class="text-block-td pc-font-alt"
                                                          style="
                                                            mso-line-height: exactly;
                                                            line-height: 24px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                            font-size: 18px;
                                                            font-weight: 500;
                                                            color: #ffffff;
                                                          "
                                                        >
                                                          Contact us
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>
                                                <tr>
                                                  <th
                                                    class="text-block-container-td pc-w620-spacing-0-0-25-0"
                                                    valign="top"
                                                    style="font-weight: normal; text-align: left; padding: 0px 0px 45px 0px"
                                                  >
                                                    <table class="text-block" border="0" cellpadding="0" role="presentation" width="100%">
                                                      <tr class="text-block-tr">
                                                        <td
                                                          valign="top"
                                                          class="text-block-td pc-font-alt"
                                                          style="
                                                            mso-line-height: exactly;
                                                            line-height: 20px;
                                                            letter-spacing: -0.2px;
                                                            font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                            font-size: 18px;
                                                            font-weight: normal;
                                                            color: #d8d8d8;
                                                          "
                                                        >
                                                          Email:
                                                          <a
                                                            class="pc-font-alt"
                                                            style="
                                                              text-decoration: none;
                                                              line-height: 24px;
                                                              letter-spacing: -0.2px;
                                                              font-family: 'Fira Sans', Helvetica, Arial, sans-serif;
                                                              font-size: 18px;
                                                              font-weight: 500;
                                                              color: #fe7e00;
                                                            "
                                                            href="mailto:hello@eatnourisha.com"
                                                            >hello@eatnourisha.com</a
                                                          >
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
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
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!-- Fix for Gmail on iOS -->
    <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0">
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>
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