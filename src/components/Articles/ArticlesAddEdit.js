import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { Editor } from "react-draft-wysiwyg";
import { convertFromRaw, convertToRaw, EditorState, Modifier } from 'draft-js';
import { getSelectedBlock } from "draftjs-utils";
import { stateFromHTML } from 'draft-js-import-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import axios from '../../interceptors/auth.interceptor';
require('dotenv').config();

const useStyles = makeStyles((theme) => (
  {
    appBarSpacer: theme.mixins.toolbar,
    root: {
      height: '90vh',
    },
    container: {
      marginTop: '1rem',
    },
    paper: {
      backgroundColor: 'lightGrey',
      margin: 'auto',
      marginTop: '0.5rem',
      width: '100%',
      marginBottom: theme.spacing(2),
      padding: '1rem',
    },
    innerContainer: {
      padding: '1rem',
    },
    formControl: {
      // margin: theme.spacing(1),
      // minWidth: 120,
      // maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }
));

const editorStyles = {
  backgroundColor: '#fff',
  minHeight: '20rem',
  marginBottom: '1rem',
  border: '1px solid grey',
  borderRadius: '5px'
}

const toolbarStyles = {
  border: '1px solid grey',
  borderRadius: '5px',
  marginTop: '1rem'
}

export default function ArticlesAddEdit() {
  const history = useHistory();

  let { articleId } = useParams();
  // console.log({articleId});

  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [title, setTitle] = useState('');

  const [saving, setSaving] = useState(false);

  const [published, setPublished] = useState(false);

  const [convertedContent, setConvertedContent] = useState(null);

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);

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

  const handleSelectedCategoryChange = (event) => {
    let flag = true;
    let newArray = event.target.value;
    let latestVal = newArray[newArray.length - 1];
    selectedCategory.forEach((value) => {
      if (value._id === latestVal._id) {
        flag = false;
      }
    });
    if (flag) {
      setSelectedCategory(event.target.value);
    }
  }

  const handlePastedText = (text, html, editorState, onChange) => {
    const selectedBlock = getSelectedBlock(editorState);
    if (selectedBlock && selectedBlock.type === 'code') {
      const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        text,
        editorState.getCurrentInlineStyle(),
      );
      onChange(EditorState.push(editorState, contentState, 'insert-characters'));
      return true;
    } else if (html) {
      const blockMap = stateFromHTML(html).blockMap;
      const newState = Modifier.replaceWithFragment(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        blockMap,
      );
      onChange(EditorState.push(editorState, newState, 'insert-fragment'));
      return true;
    }
    return false;
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    setSaving(true);
    // console.log({ title, convertedContent, published, selectedCategory });
    let apiPath = '';
    let categoryIds = selectedCategory.map((category) => {
      console.log(category);
      return category._id;
    });
    const body = {
      title: title,
      body: convertedContent,
      published,
      categoryIds,
      userId: "60e1ca28a452c928d898d85e",
    };
    console.log(body);
    if (articleId) {
      apiPath = '/api/articles/update/' + articleId;
    } else {
      apiPath = '/api/articles/insert';
    }
    try {
      const result = await axios.post(apiUrl + apiPath, body);
      console.log(result);
      history.push('../articles');
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (articleId) {
      axios.get(apiUrl + "/api/articles/" + articleId)
        .then(res => {
          console.log(res);
          setTitle(res.data.title);
          setPublished(res.data.published);
          setSelectedCategory(res.data.categoryIds);
          if (res.data.body !== null) {
            if (!res.data.body.hasOwnProperty('entityMap')) {
              res.data.body = { ...res.data.body, entityMap: {} };
            }
            const _contentState = convertFromRaw(res.data.body);
            console.log(_contentState);
            setEditorState(EditorState.createWithContent(_contentState));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    axios.get(apiUrl + "/api/categories")
      .then(res => {
        console.log(res);
        setCategories(res.data);
      })
      .catch(err => {
        console.log(err);
      });

  }, [articleId, apiUrl]);

  const classes = useStyles();

  return (
    <>
      <div className={classes.appBarSpacer} />
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Grid item xs={12} md={10}>
          <div className={classes.root}>
            <Paper className={classes.paper} elevation={5}>
              <form noValidate autoComplete="off" onSubmit={saveArticle}>
                <Grid container>
                  <Grid item xs={12}>

                    {articleId ? (title && (<TextField id="outlined-basic" label="Title" variant="outlined" value={title} fullWidth={true} />)) :
                      (<TextField id="outlined-basic" label="Title" variant="outlined" onChange={handleTitleChange} fullWidth={true} />)}

                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="demo-mutiple-chip-label">Categories</InputLabel>
                      <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={selectedCategory}
                        onChange={handleSelectedCategoryChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                          <div className={classes.chips}>
                            {selected.map((value, index) => (
                              <Chip key={index} label={value.name} className={classes.chip} />
                            ))}
                          </div>
                        )}
                      >
                        {categories.map((value, index) => (
                          <MenuItem key={index} value={value}>
                            {value.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={5}>
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
                </Grid>
                <br />
                <Grid container>
                  <Grid item xs={12}>
                    {articleId ? (editorState && (<Editor
                      editorState={editorState}
                      onEditorStateChange={handleEditorChange}
                      handlePastedText={handlePastedText}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorStyle={editorStyles}
                      toolbarStyle={toolbarStyles}
                    />)) : (<Editor
                      editorState={editorState}
                      onEditorStateChange={handleEditorChange}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorStyle={editorStyles}
                      toolbarStyle={toolbarStyles}
                      handlePastedText={handlePastedText}
                    />)}
                  </Grid>
                </Grid>
                <Grid container justify="space-evenly">
                  <Grid item>
                    <Button type="submit" variant="contained" color="primary"
                      disabled={saving}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Link to={"../articles"} style={{ textDecoration: 'none' }}>
                      <Button variant="contained">
                        Cancel
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
