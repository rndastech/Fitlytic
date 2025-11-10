"use client"
import { Box, Button, Typography, Card } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Zap, Activity, Eye, TrendingUp, ArrowRight } from "lucide-react"
import { disclaimerText } from "../assets/content"

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Zap,
      title: "Real-Time Feedback",
      description: "AI-powered form correction as you exercise",
    },
    {
      icon: Activity,
      title: "Personalized Workouts",
      description: "Custom exercises tailored to your goals",
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Advanced vision models for accuracy",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your rehabilitation journey",
    },
  ]

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%)",
        color: "#ffffff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated background grid */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(90deg, #d4af37 1px, transparent 1px), linear-gradient(#d4af37 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        {/* Hero Section */}
        <Box sx={{ maxWidth: "800px", mb: "4rem" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              px: "1rem",
              py: "0.5rem",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "50px",
              mb: "1rem",
            }}
          >
            <Zap size={16} style={{ color: "#d4af37" }} />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#d4af37",
                letterSpacing: "0.5px",
              }}
            >
              AI-Powered Fitness Intelligence
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 800,
              mb: "1.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, #d4af37 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Transform Your Form
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: "#b0b0b0",
              mb: "2rem",
              lineHeight: 1.6,
            }}
          >
            Real-time exercise form correction powered by state-of-the-art computer vision. Get instant feedback and
            achieve your fitness goals faster.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              mb: "3rem",
            }}
          >
            <Button
              onClick={() => navigate("/catalog")}
              sx={{
                px: "2.5rem",
                py: "1rem",
                fontSize: "1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                color: "#0a0e27",
                border: "none",
                borderRadius: "8px",
                textTransform: "none",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                "&:hover": {
                  background: "linear-gradient(135deg, #e8c547 0%, #d4af37 100%)",
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 15px 40px rgba(212, 175, 55, 0.4)",
                },
              }}
            >
              Start Training
              <ArrowRight size={20} />
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: "2rem",
            width: "100%",
            maxWidth: "900px",
            mb: "4rem",
          }}
        >
          {features.map((feature, idx) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={idx}
                sx={{
                  background: "rgba(26, 26, 46, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "16px",
                  padding: "2rem",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(26, 26, 46, 0.9)",
                    borderColor: "#d4af37",
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(212, 175, 55, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={24} style={{ color: "#0a0e27" }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        mb: "0.5rem",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        color: "#b0b0b0",
                        lineHeight: 1.5,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            )
          })}
        </Box>

        {/* Disclaimer */}
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "#808080",
            maxWidth: "700px",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          {disclaimerText}
        </Typography>
      </Box>
    </Box>
  )
}

export default Home
