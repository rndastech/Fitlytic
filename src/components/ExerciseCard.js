import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';

function ExerciseCard({ image, title, description, link, isPinned = false, onPinToggle }) {
  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        sx={{
          width: '100%',
          height: '100%',
          cursor: link ? 'pointer' : 'default',
          background: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            background: 'rgba(26, 26, 46, 0.9)',
            borderColor: '#d4af37',
            boxShadow: '0 20px 40px rgba(212, 175, 55, 0.15)',
          },
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onPinToggle?.();
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: 'rgba(26, 26, 46, 0.8)',
            backdropFilter: 'blur(10px)',
            color: isPinned ? '#d4af37' : '#808080',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(26, 26, 46, 0.95)',
              color: isPinned ? '#b8941f' : '#d4af37',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
        </IconButton>

        <CardActionArea
          component={link ? Link : 'div'}
          to={link || undefined}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 0,
              paddingTop: '56.25%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.25rem',
                mb: '0.75rem',
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#b0b0b0',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default ExerciseCard;
