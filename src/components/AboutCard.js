import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {Card, CardContent, CardMedia, IconButton, Typography} from '@mui/material';

export const AboutCard =
    ({img, name, affil = 'Boston University', linkedInLink}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        width: '30rem',
        maxWidth: '100%',
        background: 'rgba(26, 26, 46, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(26, 26, 46, 0.9)',
          borderColor: '#d4af37',
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(212, 175, 55, 0.15)',
        },
      }}
    >
      <CardMedia
        component='img'
        image={img}
        sx={{
          width: '15rem',
          objectFit: 'cover',
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          padding: "1.5rem",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#ffffff",
            mb: "0.5rem",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            color: '#b0b0b0',
            fontSize: '0.95rem',
            mb: '0.5rem',
          }}
        >
          {affil}
        </Typography>
        <IconButton
          href={linkedInLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: "fit-content",
            color: "#d4af37",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "#e8c547",
              transform: "scale(1.1)",
            },
          }}
        >
          <LinkedInIcon fontSize="large" />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default AboutCard;
