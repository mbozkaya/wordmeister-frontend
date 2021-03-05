import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import columns from 'src/configs/columns';
import Page from 'src/components/Page';
import wordMeisterService from 'src/services/wordMeisterService';
import DataTable from '../../components/Datatable/DataTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const KeywordView = () => {
  const classes = useStyles();

  const getRegisters = (model) => wordMeisterService.getKeywords(model);

  const { register } = columns;
  return (
    <Page
      className={classes.root}
      title="Keywords"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <DataTable
            columns={register}
            rowEdit={(model) => wordMeisterService.updateRegister(model)}
            insertNewRow={(model) => wordMeisterService.createRegister(model)}
            removeRow={(model) => wordMeisterService.removeRegister(model)}
            getData={getRegisters}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default KeywordView;
