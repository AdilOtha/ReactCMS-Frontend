import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { Editor } from "react-draft-wysiwyg";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
require('dotenv').config();

const useStyles = makeStyles((theme) => (
  {
    appBarSpacer: theme.mixins.toolbar,
    root: {
      height: '90vh',
    },
  }
));

const editorStyles = {
  backgroundColor: 'white',
  minHeight: '300px',
  marginBottom: '1rem'
}

export default function SingleArticle() {
  const history = useHistory();

  let { articleId } = useParams();
  // console.log({articleId});

  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [title, setTitle] = useState('');

  const [saving, setSaving] = useState(false);

  const [published, setPublished] = useState(false);

  const [convertedContent, setConvertedContent] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }

  const handleEditorChange = (state) => {
    setEditorState(state);
    setConvertedContent(convertToRaw(state.getCurrentContent()));
  }

  const handlePublishedChange = (event) => {
    setPublished((prevVal) => {
      return !prevVal;
    });
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    setSaving(true);
    console.log({ title, convertedContent, published });
    let apiPath = '';
    const body = {
      title: title,
      body: convertedContent,
      published,
      userId: "60e1ca28a452c928d898d85e",
    }
    if (articleId) {
      apiPath = '/api/articles/update/' + articleId;
    } else {
      apiPath = '/api/articles/insert';
    }
    try {
      const result = await axios.post(apiUrl + apiPath, body);
      console.log(result);
      history.push('/articles');
    } catch (err) {
      console.log(err);
    }
  }

  console.log(convertedContent);

  useEffect(() => {
    if (articleId) {
      axios.get(apiUrl + "/api/articles/" + articleId)
        .then(res => {
          console.log(res);
          setTitle(res.data.title);
          if (!res.data.body.hasOwnProperty('entityMap')) {
            res.data.body = { ...res.data.body, entityMap: {} };
          }
          const _contentState = convertFromRaw(res.data.body);
          console.log(_contentState);
          setEditorState(EditorState.createWithContent(_contentState));
        })
        .catch(err => {
          console.log(err);
        });
    }

  }, [articleId]);

  const classes = useStyles();

  console.log(classes.appBarSpacer);

  return (
    <>
      <div className={classes.appBarSpacer} />
      <div className={classes.root}>
        <br />
        <form noValidate autoComplete="off" onSubmit={saveArticle}>
          <Grid
            container
            item
            direction="row"
            justify="space-evenly"
            alignItems="center"
            md={12}
          >
            <Grid item>

              {articleId ? (title && (<TextField id="outlined-basic" label="Title" variant="outlined" value={title} />)) :
                (<TextField id="outlined-basic" label="Title" variant="outlined" onChange={handleTitleChange} />)}

            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={published}
                    onChange={handlePublishedChange}
                    name="published"
                    color="primary"
                  />
                }
                label="Published"
              />
            </Grid>
          </Grid>
          <br />
          <Grid container justify="center">
            <Grid item sm={12} md={6}>
              {articleId ? (editorState && (<Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorStyle={editorStyles}
              />)) : (<Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorStyle={editorStyles}
              />)}
            </Grid>
          </Grid>
          <Grid container item direction="row" alignContent="center" justify="space-evenly" xs={12}>
            <Grid item>
              <Button type="submit" variant="contained" color="primary"
                disabled={saving}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Link to={"/articles"} style={{ textDecoration: 'none' }}>
                <Button variant="contained">
                  Cancel
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}
