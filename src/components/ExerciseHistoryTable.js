import Delete from '@mui/icons-material/DeleteForever';
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,} from '@mui/material';
import {deleteField, doc, updateDoc} from 'firebase/firestore';
import React, {useState} from 'react';

import {auth, db} from '../firebaseConfig';

const ExerciseHistoryTable = ({exerciseHistory, setExerciseHistory}) => {
  const [orderBy, setOrderBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === 'exercise') {
        return order === 'asc' ? a.exercise.localeCompare(b.exercise) :
                                 b.exercise.localeCompare(a.exercise);
      } else {
        return order === 'desc' ? b[orderBy] - a[orderBy] :
                                  a[orderBy] - b[orderBy];
      }
    };

    return [...exerciseHistory].sort(comparator);
  }, [exerciseHistory, order, orderBy]);

  const deleteExerciseEntry = async (timestamp) => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      console.error('User is not logged in.');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.email);
      await updateDoc(userRef, {
        [`exerciseHistory.${timestamp}`]: deleteField(),
      });

      setExerciseHistory(
          (prevHistory) =>
              prevHistory.filter((entry) => entry.timestamp !== timestamp));

      console.log('Exercise deleted:', timestamp);
    } catch (e) {
      console.error('Error deleting exercise:', e);
    }
  };

  return (
    <TableContainer
  component = {Paper} sx = {
    {
      background: 'transparent', boxShadow: 'none', p: '0.5rem',
    }
  } > <Table sx = {
                    {
                      minWidth: 650
                    }
                           }><TableHead><TableRow sx = {
                             {
                               borderBottom: '2px solid rgba(212, 175, 55, 0.3)'
                             }
                           }>< TableCell
  sx = {
    {
      fontSize: '1.1rem', fontWeight: 'bold', color: '#d4af37',
          borderBottom: 'none',
    }
  } > <
      TableSortLabel
  active = {orderBy === 'timestamp'} direction =
      {orderBy === 'timestamp' ?
           order :
           'asc'} onClick = {() => handleRequestSort('timestamp')} sx = {
        {
          color: '#d4af37 !important', '&:hover': {color: '#e8c547 !important'},
              '& .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
              '&.Mui-active': {color: '#d4af37 !important'},
              '&.Mui-active .MuiTableSortLabel-icon':
                  {color: '#d4af37 !important'},
        }
      } > Date &
      Time</TableSortLabel>
            </TableCell>< TableCell
  sx = {
    {
      fontSize: '1.1rem', fontWeight: 'bold', color: '#d4af37',
          borderBottom: 'none',
    }
  } > <
      TableSortLabel
  active = {orderBy === 'exercise'} direction = {
      orderBy === 'exercise' ?
          order :
          'asc'} onClick = {() => handleRequestSort('exercise')} sx = {
    {
      color: '#d4af37 !important', '&:hover': {color: '#e8c547 !important'},
          '& .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
          '&.Mui-active': {color: '#d4af37 !important'},
          '&.Mui-active .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
    }
  } > Exercise</TableSortLabel>
            </TableCell>< TableCell
  align = 'right'
  sx = {
    {
      fontSize: '1.1rem', fontWeight: 'bold', color: '#d4af37',
          borderBottom: 'none',
    }
  } > <
      TableSortLabel
  active = {orderBy === 'duration'} direction = {
      orderBy === 'duration' ?
          order :
          'asc'} onClick = {() => handleRequestSort('duration')} sx = {
    {
      color: '#d4af37 !important', '&:hover': {color: '#e8c547 !important'},
          '& .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
          '&.Mui-active': {color: '#d4af37 !important'},
          '&.Mui-active .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
    }
  } > Duration(s)</TableSortLabel>
            </TableCell>< TableCell
  align = 'right'
  sx = {
    {
      fontSize: '1.1rem', fontWeight: 'bold', color: '#d4af37',
          borderBottom: 'none',
    }
  } > <
      TableSortLabel
  active = {orderBy === 'repCount'} direction = {
      orderBy === 'repCount' ?
          order :
          'asc'} onClick = {() => handleRequestSort('repCount')} sx = {
    {
      color: '#d4af37 !important', '&:hover': {color: '#e8c547 !important'},
          '& .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
          '&.Mui-active': {color: '#d4af37 !important'},
          '&.Mui-active .MuiTableSortLabel-icon': {color: '#d4af37 !important'},
    }
  } > Rep Count</TableSortLabel>
            </TableCell>< TableCell
  align = 'right'
  sx = {
    {
      fontSize: '1.1rem', fontWeight: 'bold', color: '#d4af37',
          borderBottom: 'none',
    }
  } > Delete ?
      </TableCell>
          </TableRow>
      </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow
              key={row.timestamp}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                fontSize: "1.05rem",
                borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(212, 175, 55, 0.05)",
                  transform: "scale(1.01)",
                },
              }}>
              <TableCell 
                component="th" 
                scope="row" 
                sx={{ 
                  fontSize: "1.05rem",
                  color: "#ffffff",
                  borderBottom: "none",
                }}
              >
                {new Date(row.timestamp).toLocaleString()}
              </TableCell><
      TableCell
  sx = {
    {
      fontSize: '1.05rem', color: '#ffffff', borderBottom: 'none',
    }
  } > {row.exercise} <
      /TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontSize: "1.05rem",
                  color: "#b0b0b0",
                  borderBottom: "none",
                }}
              >
                {row.duration}
              </TableCell >
      < TableCell
  align = 'right'
                sx={{
    fontSize: '1.05rem', color: '#b0b0b0', borderBottom: 'none',
                }}
              >
                {row.repCount}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ borderBottom: "none" }}
              >
                <IconButton
                  onClick={() => deleteExerciseEntry(row.timestamp)}
                  sx={{ 
                    color: "#ff6b6b",
                    transition: "all 0.3s ease",
                    "&:hover": { 
                      color: "#ff5252",
                      background: "rgba(255, 82, 82, 0.1)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExerciseHistoryTable;
