import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordTemplateProps {
  resetUrl: string;
}

export function ResetPasswordTemplate({
  resetUrl,
}: ResetPasswordTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>
              Eat<span style={headerTextOrange}>UP</span>
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={title}>Şifre Sıfırlama Talebi</Text>

            <Text style={paragraph}>Merhaba,</Text>

            <Text style={paragraph}>
              Hesabınız için bir şifre sıfırlama talebi aldık. Şifrenizi
              sıfırlamak için aşağıdaki butona tıklayın:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Şifremi Sıfırla
              </Button>
            </Section>

            <Text style={paragraphSmall}>
              Ya da aşağıdaki bağlantıyı tarayıcınıza kopyalayın:
            </Text>

            <Text style={urlText}>{resetUrl}</Text>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ Bu bağlantı <strong>1 saat</strong> geçerlidir.
              </Text>
            </Section>

            <Text style={paragraphSmall}>
              Bu talebi siz yapmadıysanız, bu e-postayı görmezden
              gelebilirsiniz. Şifreniz değiştirilmeyecektir.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>© 2025 EatUP. Tüm hakları saklıdır.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: "Arial, sans-serif",
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
