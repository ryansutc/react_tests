import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Typography, ListItemText } from '@material-ui/core';
import { Home, Book, AccountBox } from '@material-ui/icons';

function NavBar(props) {

  return (
    <List component="nav">
      <ListItem component="div">
        <ListItemText inset>
          <Typography color="inherit" variant="body1">
            Home <Home />
          </Typography>
        </ListItemText>
        <ListItemText inset>
          <Typography color="inherit" variant="body1">
            Posts <Book />
          </Typography>
        </ListItemText>

        <ListItemText inset>
          <Typography color="inherit" variant="body1">
            Contact <AccountBox />
          </Typography>
        </ListItemText>
      </ListItem >
    </List>
  )
}

export default NavBar;