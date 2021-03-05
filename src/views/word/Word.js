import React, { useState } from 'react';
import * as Yup from 'yup';
import {
  Box,
  Card,
  Container,
  Grid,
  makeStyles,
  TextField,
  CardHeader,
  CardContent,
  Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import DataTable from 'src/components/Datatable/DataTable';
import columns from 'src/configs/columns';
import { Formik } from 'formik';
import wordMeisterService from 'src/services/wordMeisterService';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  fullWidthInput: {
    'fullWidth-input': {
      width: '%100',
    }
  }
}));

const Word = () => {
  const classes = useStyles();
  const [dataFlag, setDataFlag] = useState(false);

  return (
    <Page
      className={classes.root}
      title="Keywords"
    >
      <Container maxWidth={false} key="container">
        <Grid container spacing={3} key="wrapperGrid">
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
            key="grid1"
          >
            <DataTable
              columns={columns.word}
              rowEdit={(model) => wordMeisterService.updateWord(model)}
              getData={(model) => wordMeisterService.getWords(model)}
              removeRow={(model) => wordMeisterService.deleteWord(model)}
              getDataFlag={dataFlag}
            />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
            key="grid2"
          >
            <Card>
              <CardHeader
                subheader="Create a new word"
                title="Word"
              />
              <CardContent>
                <Formik
                  initialValues={{
                    text: '',
                    description: ''
                  }}
                  validationSchema={
                    Yup.object().shape({
                      text: Yup.string().max(255).required('Word text is required'),
                    })
                  }
                  onSubmit={(form, { resetForm }) => {
                    wordMeisterService.addWord(form).then((response) => {
                      if (response && response.error === false) {
                        resetForm({
                          text: '',
                          description: ''
                        });
                        setDataFlag(!dataFlag);
                      }
                    });
                  }}
                >
                  {
                    ({
                      errors,
                      handleChange,
                      handleSubmit,
                      touched,
                      values,
                    }) => (
                      <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Grid
                          container
                          spacing={3}
                          key="grid6"
                        >
                          <Grid item sm={12} key="grid3">
                            <TextField
                              fullWidth
                              error={Boolean(touched.text && errors.text)}
                              helperText={touched.text && errors.text}
                              label="word text"
                              name="text"
                              required
                              variant="outlined"
                              value={values.text}
                              onChange={handleChange}
                              key="textfield1"
                            />
                          </Grid>
                          <Grid item sm={12} key="grid4">
                            <TextField
                              fullWidth
                              label="description"
                              name="description"
                              variant="outlined"
                              value={values.description}
                              onChange={handleChange}
                              key="textfield2"
                            />
                          </Grid>
                          <Grid item sm={6} key="grid5">
                            <Button
                              color="primary"
                              variant="contained"
                              type="submit"
                            >
                              Create
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    )
                  }

                </Formik>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box mt={3} />
      </Container>
    </Page>
  );
};

export default Word;
