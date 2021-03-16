import React, { useEffect } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ReactHtmlParser from 'react-html-parser';
import clsx from 'clsx';

import BreadcrumbIcon from '../icons/BreadcrumbIcon';
import Title from '../title';
import LinkIcon from '../icons/LinkIcon';

export interface QuestionItem {
  question: string;
  answer: string;
}

interface QuestionProps extends QuestionItem {
  first?: boolean;
  last?: boolean;
  questionId?: string;
}

interface StyleProps {
  first: boolean;
  last: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  root: props => ({
    borderBottom: !props.last ? `1px solid ${theme.palette.grey[100]}` : 'none',
    [theme.breakpoints.up('sm')]: {
      paddingTop: props.first ? theme.spacing(7) : theme.spacing(12.5),
      paddingBottom: theme.spacing(5),
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: props.first ? theme.spacing(7) : theme.spacing(10.75),
      paddingBottom: theme.spacing(3.75),
    },
  }),
  container: {
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(5.25)}`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: `0 ${theme.spacing(7.75)}`,
    },
  },
  question: {
    lineHeight: '150%',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(2.5),
    },
  },
  icon: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(5),
      width: theme.spacing(8.25),
      marginLeft: theme.spacing(5),
    },
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing(3.5),
      width: theme.spacing(5.75),
      marginLeft: theme.spacing(3.125),
    },
  },
  gradient: {
    position: 'absolute',
    top: theme.spacing(4),
    width: '100%',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 61.46%)',
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(21.75),
    },
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing(18),
    },
  },
  collapsed: {
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      maxHeight: theme.spacing(21.75),
    },
    [theme.breakpoints.down('xs')]: {
      maxHeight: theme.spacing(18),
    },
  },
  answer: {
    lineHeight: '150%',
    position: 'relative',
    '& ul, ol': {
      listStyle: 'none',
      marginLeft: theme.spacing(3),
    },
    '& li p:first-child': {
      display: 'inline',
    },
    '& li::before': {
      content: "'\\2022'",
      color: theme.palette.secondary.main,
      display: 'inline-block',
      width: '1em',
      marginLeft: '-1em',
      fontSize: theme.spacing(3),
    },
    '& a': {
      color: theme.palette.secondary.main,
      fontWeight: 'bold',
      textDecoration: 'none',
      '&:link, &:visited, &:hover, &:active': {
        textDecoration: 'none',
      },
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(4.5),
      marginRight: theme.spacing(14.25),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.spacing(4),
      marginRight: theme.spacing(5.75),
    },
    '& span.gatsby-resp-image-background-image': {
      position: 'absolute !important',
    },
    '& img.gatsby-resp-image-image': {
      position: 'relative !important',
    },
  },
  anchorLink: {
    color: 'transparent',
    textDecoration: 'none',
    '&:link, &:visited, &:hover, &:active': {
      textDecoration: 'none',
    },
  },
  linkIcon: {
    position: 'absolute',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2.5),
      width: theme.spacing(7.5),
      height: theme.spacing(7.5),
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(2),
      width: theme.spacing(5.5),
      height: theme.spacing(5.5),
    },
  },
}));

const Question = ({
  question,
  answer,
  questionId,
  first = false,
  last = false,
}: QuestionProps): JSX.Element => {
  const id = question
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/\-+$/, '');
  const [open, setOpen] = React.useState(id === questionId);
  const classes = useStyles({ first, last });
  const theme = useTheme();

  useEffect(() => {
    setOpen(id === questionId);
  }, [id, questionId]);

  const handleClick = (): void => {
    setOpen(prevOpen => !prevOpen);
  };

  const answerClassName = [classes.answer];
  if (!open) {
    answerClassName.push(classes.collapsed);
  }

  return (
    <div className={classes.root} id={id}>
      <div className={classes.container}>
        <Grid container wrap="nowrap" justify="space-between" alignItems="center">
          <Grid item>
            <Title variant="h5" className={classes.question}>
              {question}
              <a href={`#${id}`} className={classes.anchorLink}>
                <LinkIcon
                  className={classes.linkIcon}
                  color="transparent"
                  hoverColor={theme.palette.secondary.dark}
                />
              </a>
            </Title>
          </Grid>
          <Grid item>
            {open ? (
              <BreadcrumbIcon onClick={handleClick} className={classes.icon} direction="up" />
            ) : (
              <BreadcrumbIcon onClick={handleClick} className={classes.icon} />
            )}
          </Grid>
        </Grid>
        <div className={clsx(answerClassName)}>
          {ReactHtmlParser(answer)}
          {open ? null : <div className={classes.gradient} />}
        </div>
      </div>
    </div>
  );
};

export default Question;
