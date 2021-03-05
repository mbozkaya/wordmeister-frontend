/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */

import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  makeStyles,
  Divider,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Fab,
  withStyles,
  TextField,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Switch,
  Drawer,
  Tooltip
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import AddIcon from '@material-ui/icons/Add';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';
import Rating from '@material-ui/lab/Rating';
import Page from 'src/components/Page';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import wordMeisterService from 'src/services/wordMeisterService';
import ToasterSnackbar from 'src/components/ToasterSnackbar';
import * as Yup from 'yup';
import { Formik } from 'formik';
import WordCardSettings from 'src/components/Word/WordSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  listRoot: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  numberTypography: {
    opacity: '0.5',
    textAlign: 'center',
  },
  mainRoot: {
    flexGrow: 1,
  },
  backgroundPaper: {
    backgroundColor: theme.palette.background.paper
  },
  starIcon: {
    '&:hover': {
      transform: 'scale(1.5)',
    },
  },
  customSentence: {
    margin: '2px',
    padding: '30px'
  },
  headerTypography: {
    fontFamily: 'Playfair Display,serif',
    fontSize: '34px',
    letterSpacing: '.9px',
    paddingRight: '10px',
    color: '#303336',
  },
  headerWrapper: {
    textAlign: '-webkit-center'
  },
  subHeaderTypography: {
    color: '#4a7d95',
    fontFamily: 'Playfair Display,serif',
    fontSize: '26px',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: '700',
    letterSpacing: '.5px',
    lineHeight: '36px',
    textDecoration: 'none',
  },
  headerGrid: {
    minHeight: '100px',
  },
  headerActions: {
    width: '-webkit-fill-available',
    marginTop: '5px',
  },
  nowrap: {
    whiteSpace: 'nowrap'
  },
  frequency: {
    minHeight: '58px;'
  }
}));

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const WordCard = () => {
  const goldColor = '#ffb400';

  const tabsEnum = {
    definations: 0,
    sentences: 1
  };
  const classes = useStyles();
  const [cardData, setCardData] = useState({
    userWordId: 0,
    word: '',
    description: '',
    sentences: [],
    isOver: false,
    isFavorite: false,
    isLearned: false,
    point: 0,
    frequency: 0,
    definations: [],
    prononciations: {},
    wordCount: 0,
    currentIndex: 1,
  });

  const [showAddSentence, setShowAddSentence] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentIndexRef = useRef(cardData.currentIndex);
  const currentTabRef = useRef(currentTab);
  const showAddSentenceRef = useRef(showAddSentence);

  const getData = (currentIndex, isRandom = false) => {
    const model = {
      currentIndex,
      isRandom
    };
    wordMeisterService.getWordCard(model).then((response) => {
      if (response && response.error === false) {
        const { data } = response;
        setCardData({
          ...cardData,
          ...data,
          point: data.point / 2,
          currentIndex: data.currentIndex,
        });
      } else {
        ToasterSnackbar.error({ message: response.errorMessage });
      }
    });
  };

  const navigateButton = (e) => {
    switch (e.code.toLowerCase()) {
      case 'arrowleft':
        getData(currentIndexRef.current - 1 > 0 ? currentIndexRef.current - 1 : 1);
        break;
      case 'arrowright':
        getData(currentIndexRef.current + 1);
        break;
      case 'space':
        if (!showAddSentenceRef.current && currentTabRef.current === tabsEnum.sentences) {
          setShowAddSentence(true);
        }
        break;
      case 'keyd':
        if (e.target.tagName === 'BODY') {
          setCurrentTab(tabsEnum.definations);
        }
        break;
      case 'keys':
        if (e.target.tagName === 'BODY') {
          setCurrentTab(tabsEnum.sentences);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getData();
    window.addEventListener('keyup', (e) => navigateButton(e, cardData, currentTab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { window.removeEventListener('keyup', navigateButton); };
  }, []);

  useEffect(() => { currentIndexRef.current = cardData.currentIndex; }, [cardData.currentIndex]);
  useEffect(() => { showAddSentenceRef.current = showAddSentence; }, [showAddSentence]);
  useEffect(() => { currentTabRef.current = currentTab; }, [currentTab]);

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  };

  return (
    <>
      <Page
        className={classes.root}
        title={cardData.word}
      >
        <div className={classes.mainRoot}>
          <Grid
            container
            spacing={3}
          >
            <Grid item xs={12}>
              <Grid container justify="center" spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={8}>
                  <Grid container className={classes.headerGrid}>
                    <Grid item xs={2} className={classes.backgroundPaper}>
                      <Grid item xs={12}>
                        <Grid container justify="center" alignContent="center">
                          <Grid item xs={8}>
                            <Box component="fieldset" mb={3} borderColor="transparent">
                              <Tooltip title={cardData.point === 0 ? 'Give your first point to words.' : 'Change your points'} enterDelay={800} leaveDelay={200}>
                                <StyledRating
                                  name="customized-color"
                                  value={cardData.point}
                                  getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                  precision={0.5}
                                  icon={<FavoriteIcon fontSize="inherit" />}
                                  onChange={(e, v) => {
                                    if (v !== cardData.point) {
                                      const model = {
                                        userWordId: cardData.userWordId,
                                        point: v * 2,
                                      };
                                      wordMeisterService.setWordPoint(model).then((response) => {
                                        if (response && response.error === false) {
                                          setCardData({
                                            ...cardData,
                                            point: v,
                                          });
                                        } else {
                                          ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
                                        }
                                      });
                                    }
                                  }}
                                  className={classes.headerActions}
                                />
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justify="center" alignContent="center">
                          <Grid item xs={8}>
                            <FormControlLabel
                              control={(
                                <Switch
                                  checked={cardData.isLearned}
                                  onChange={() => {
                                    const model = {
                                      userWordId: cardData.userWordId,
                                      isLearned: !cardData.isLearned,
                                    };
                                    wordMeisterService.setLearned(model).then((response) => {
                                      if (response && response.error === false) {
                                        setCardData({
                                          ...cardData,
                                          isLearned: !cardData.isLearned
                                        });
                                        ToasterSnackbar.success({ message: `${cardData.word} setted as learned successfully` });
                                      } else {
                                        ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
                                      }
                                    });
                                  }}
                                  name="checkedB"
                                  color="primary"
                                />
                              )}
                              label={`${cardData.isLearned ? 'Learned' : 'Not learned'}`}
                              className={`${classes.headerActions} ${classes.nowrap}`}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={8} className={classes.backgroundPaper}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.headerWrapper}>
                          {cardData.isLearned ? '✅' : ''}
                          <Typography align="center" display="inline" className={classes.headerTypography}>{cardData.word}</Typography>
                          <Typography align="center" display="inline">{cardData.prononciations !== null ? cardData.prononciations.all : ''}</Typography>
                          <Divider variant="middle" />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography align="center" className={classes.subHeaderTypography}>{cardData.description}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2} className={classes.backgroundPaper}>
                      <Grid item xs={12}>
                        <Grid container justify="center" alignContent="center">
                          <Grid item xs={4}>
                            <ToggleButton
                              title={cardData.isFavorite ? 'Remove star' : 'Give star'}
                              onClick={() => {
                                const model = {
                                  userWordId: cardData.userWordId,
                                  isFavorite: !cardData.isFavorite,
                                };
                                wordMeisterService.setWordFavorite(model).then((response) => {
                                  if (response && response.error === false) {
                                    setCardData({
                                      ...cardData,
                                      isFavorite: model.isFavorite
                                    });
                                  } else {
                                    ToasterSnackbar.error({ message: response.errorMessage || 'An error occured' });
                                  }
                                });
                              }}
                              value={cardData.isFavorite}
                              className={classes.headerActions}
                            >
                              <Tooltip title={cardData.isFavorite ? 'Remove from favorites' : 'Add words as favorite'} enterDelay={800} leaveDelay={200}>
                                <StarIcon htmlColor={cardData.isFavorite ? goldColor : ''} className={classes.starIcon} />
                              </Tooltip>
                            </ToggleButton>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justify="center" alignContent="center" className={classes.frequency}>
                          <Grid item xs={8}>
                            <Tooltip title="This is the number of times the word is likely to appear in any English corpus, per million words.">
                              <Typography align="center" className={classes.headerActions}>
                                {cardData.frequency !== 0 ? `${cardData.frequency}/1M` : '-'}
                              </Typography>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Button type="button" size="small" onClick={() => setSettingsOpen(true)}>
                    <Tooltip title="Fetch words using filter" enterDelay={500}>
                      <SettingsIcon />
                    </Tooltip>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center" direction="row" spacing={2}>
                <Grid item xs={2}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                    <Box>
                      <Button
                        type="button"
                        disabled={cardData.currentIndex < 1}
                        onClick={() => getData(cardData.currentIndex - 1 > 0 ? cardData.currentIndex - 1 : 1)}
                      >
                        <ArrowBackIosIcon />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={8}>
                  <Grid container className={classes.listRoot}>
                    <Grid item xs={12}>
                      <Tabs
                        value={currentTab}
                        onChange={(event, newValue) => { setCurrentTab(newValue); }}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="Definations" {...a11yProps(tabsEnum.definations)} />
                        <Tab label="Sentences" {...a11yProps(tabsEnum.sentences)} />
                      </Tabs>
                    </Grid>
                    <Grid item xs={12}>
                      {
                        currentTab === tabsEnum.definations && Array.isArray(cardData.definations) && (
                          <List>
                            {
                              cardData.definations.map((value, index) => (
                                <ListItem alignItems="flex-start" key={`${index}listItemdef`}>
                                  <ListItemAvatar key={`${index}avatar`}>
                                    <Typography variant="h1" className={classes.numberTypography} key={`${index}typodef`}>{index + 1}</Typography>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={value.defination}
                                    key={`${index}listItemtextdefination`}
                                    secondary={value.type}
                                  />
                                </ListItem>
                              ))
                            }
                          </List>
                        )
                      }
                      {
                        currentTab === tabsEnum.sentences && (
                          <List>
                            {
                              cardData.sentences == null || cardData.sentences?.length === 0 ? (
                                <ListItem>
                                  <ListItemText>
                                    <Typography variant="h1" className={classes.typography}>No data to show.</Typography>
                                  </ListItemText>
                                </ListItem>
                              ) : (
                                <>
                                  {

                                      cardData.sentences.map((sentence, index) => (
                                        <>
                                          <ListItem alignItems="flex-start" key={`${index}listItem`}>
                                            <ListItemAvatar key={`${index}avatar`}>
                                              <Typography variant="h1" className={classes.numberTypography} key={`${index}typo`}>{index + 1}</Typography>
                                            </ListItemAvatar>
                                            <ListItemText
                                              primary={sentence}
                                              key={`${index}listItemtext`}
                                            />
                                          </ListItem>
                                          <Divider key={`${index}divider`} variant="inset" component="li" />
                                        </>
                                      ))
                                    }
                                </>
                              )
                            }
                            <ListItem>
                              <Grid container direction="row">
                                <Grid item xs={4} />
                                <Grid item xs={4}>
                                  <Grid container justify="center">
                                    <Fab color="primary" aria-label="add" title="Add new custom sentence" onClick={() => setShowAddSentence(!showAddSentence)}>
                                      <AddIcon />
                                    </Fab>
                                  </Grid>
                                </Grid>
                                <Grid item xs={4} />
                              </Grid>
                            </ListItem>
                          </List>
                        )
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Box>
                      <Button
                        type="button"
                        disabled={cardData.currentIndex >= cardData.wordCount}
                        onClick={() => getData(cardData.currentIndex + 1)}
                      >
                        <ArrowForwardIosIcon />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {
              showAddSentence && (
                <Grid item xs={12}>
                  <Grid container justify="center" direction="row">
                    <Grid item xs={2} />
                    <Grid item xs={8} className={classes.backgroundPaper}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Formik
                            onSubmit={(model) => {
                              model.userWordId = cardData.userWordId;
                              wordMeisterService.setCustomSentence(model).then((response) => {
                                if (response && response.error === false) {
                                  ToasterSnackbar.success({ message: 'Your sentece added successfully' });
                                  getData(cardData.currentIndex);
                                  setShowAddSentence(false);
                                } else {
                                  ToasterSnackbar.success({ message: response.errorMessage || 'An error occured' });
                                }
                              });
                            }}
                            initialValues={{
                              sentence: '',
                              isPrivate: false,
                            }}
                            validationSchema={
                              Yup.object().shape({
                                sentence: Yup.string()
                                  .min(cardData.word.length + 1, 'too less your sentence')
                                  .required('You should enter a sentence.')
                                  .matches(new RegExp(cardData.word, 'gi'), `You should use the ${cardData.word} your sentence.`)
                              })
                            }
                          >
                            {
                              ({
                                errors,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                touched,
                                values
                              }) => (
                                <form onSubmit={handleSubmit} className={classes.customSentence}>
                                  <Box my={2}>
                                    <TextField
                                      error={Boolean(touched.sentence && errors.sentence)}
                                      fullWidth
                                      helperText={touched.sentence && errors.sentence}
                                      label="Custom Sentence"
                                      placeholder="Enter a sentence"
                                      multiline
                                      variant="outlined"
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.sentence}
                                      name="sentence"
                                      autoFocus
                                    />
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="This sentence showed only me."
                                    />
                                  </Box>
                                  <Grid container direction="row">
                                    <Grid item xs={4} />
                                    <Grid item xs={4}>
                                      <Grid container justify="center">
                                        <Button
                                          color="primary"
                                          size="medium"
                                          type="submit"
                                          variant="contained"
                                        >
                                          Add
                                        </Button>
                                      </Grid>
                                    </Grid>
                                    <Grid item xs={4} />
                                  </Grid>
                                </form>
                              )
                            }
                          </Formik>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2} />
                  </Grid>
                </Grid>
              )
            }
          </Grid>
          <Drawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
            <WordCardSettings drawerOpen={settingsOpen} onSettingsChange={() => getData()} />
          </Drawer>
        </div>
      </Page>
    </>
  );
};

export default WordCard;
