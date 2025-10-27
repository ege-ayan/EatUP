interface ResetPasswordTemplateProps {
  resetUrl: string;
}

export function ResetPasswordTemplate({
  resetUrl,
}: ResetPasswordTemplateProps) {
  return (
    <html lang="tr" dir="ltr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={main}>
        <table
          align="center"
          width="100%"
          border={0}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={tableWrapper}
        >
          <tbody>
            <tr>
              <td>
                <table
                  align="center"
                  width="100%"
                  border={0}
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  style={container}
                >
                  <tbody>
                    <tr>
                      <td>
                        {/* Header */}
                        <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={header}>
                                <h1 style={headerText}>
                                  Eat<span style={headerTextOrange}>UP</span>
                                </h1>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Content */}
                        <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={content}>
                                <h2 style={title}>Şifre Sıfırlama Talebi</h2>

                                <p style={paragraph}>Merhaba,</p>

                                <p style={paragraph}>
                                  Hesabınız için bir şifre sıfırlama talebi aldık. Şifrenizi
                                  sıfırlamak için aşağıdaki butona tıklayın:
                                </p>

                                {/* Button */}
                                <table width="100%" border={0} cellPadding="0" cellSpacing="0" style={buttonContainer}>
                                  <tbody>
                                    <tr>
                                      <td align="center">
                                        <a style={button} href={resetUrl} target="_blank" rel="noopener noreferrer">
                                          Şifremi Sıfırla
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <p style={paragraphSmall}>
                                  Ya da aşağıdaki bağlantıyı tarayıcınıza kopyalayın:
                                </p>

                                <p style={urlText}>{resetUrl}</p>

                                {/* Warning Box */}
                                <table width="100%" border={0} cellPadding="0" cellSpacing="0">
                                  <tbody>
                                    <tr>
                                      <td style={warningBox}>
                                        <p style={warningText}>
                                          ⚠️ Bu bağlantı <strong>1 saat</strong> geçerlidir.
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <p style={paragraphSmall}>
                                  Bu talebi siz yapmadıysanız, bu e-postayı görmezden
                                  gelebilirsiniz. Şifreniz değiştirilmeyecektir.
                                </p>

                                <hr style={hr} />

                                <p style={footer}>© 2025 EatUP. Tüm hakları saklıdır.</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

const main = {
  backgroundColor: "#f9fafb",
  fontFamily: "Arial, sans-serif",
  margin: "0",
  padding: "0",
};

const tableWrapper = {
  maxWidth: "600px",
  margin: "0 auto",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const header = {
  background: "linear-gradient(135deg, #10b981 0%, #f97316 100%)",
  padding: "30px",
  textAlign: "center" as const,
  borderRadius: "10px 10px 0 0",
};

const headerText = {
  color: "#ffffff",
  margin: "0",
  fontSize: "28px",
  fontWeight: "bold",
};

const headerTextOrange = {
  color: "#fbbf24",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "0 0 10px 10px",
};

const title = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "0",
  marginBottom: "20px",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const paragraphSmall = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#10b981",
  color: "#ffffff",
  padding: "14px 30px",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  display: "inline-block",
};

const urlText = {
  backgroundColor: "#ffffff",
  padding: "12px",
  borderRadius: "6px",
  wordBreak: "break-all" as const,
  fontSize: "13px",
  color: "#4b5563",
  border: "1px solid #e5e7eb",
  margin: "16px 0",
};

const warningBox = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "15px",
  margin: "20px 0",
  borderRadius: "4px",
};

const warningText = {
  margin: "0",
  color: "#92400e",
  fontSize: "14px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "30px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "0",
};
