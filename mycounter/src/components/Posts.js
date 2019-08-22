import React from "react";
import { CardActionArea, Card, CardActions, CardContent, CardMedia, Button } from "@material-ui/core";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { posts } from "./dummy-post";

import { FiberPin } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  container: {
    margin: 5,
    padding: 10
  },
  content: {
    height: 40
  }
}))

function Posts(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={4} justify="center" className={classes.container}>
      {posts.map(post => (
        <Grid item key={post.title} alignItems="center" xs={12} sm={6} lg={3}>
          <Card className={classes.paper}>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image={post.image}
                title="Comptenmplative REptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography className={classes.content} component="p" noWrap>{post.excerpt}</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
                </Button>
              <Button size="small" color="primary">
                Learn More
                </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default Posts;