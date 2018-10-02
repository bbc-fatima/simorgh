import React, { Fragment } from 'react';
import { bool, string, shape } from 'prop-types';
import Metadata from '../../components/Metadata';
import Header from '../../components/Header';
import Footer from '../Footer';
import headings from '../Headings';
import text from '../Text';
import image from '../Image';
import Blocks from '../Blocks';
import MainContent from '../../components/MainContent';
import articlePropTypes from '../../models/propTypes/article';
import { ServiceContextProvider } from '../../components/ServiceContext';
import serviceConfig from '../../lib/serviceConfig';

const componentsToRender = {
  headline: headings,
  subheading: headings,
  text,
  image,
};

/* An array of each thingLabel from tags.about & tags.mention */
const allTags = tags => {
  const { about, mentions } = tags;
  const aboutTags = about ? about.map(thing => thing.thingLabel) : [];
  const mentionTags = mentions ? mentions.map(thing => thing.thingLabel) : [];
  return aboutTags.concat(mentionTags);
};

const metadataProps = (isAmp, config, id, metadata, promo, service) => {
  /* Canonical link generated from servicename and id */
  const canonicalLink = `https://www.bbc.com/${service}/articles/${id}`;
  const timeFirstPublished = new Date(metadata.firstPublished).toISOString();
  const timeLastUpdated = new Date(metadata.lastUpdated).toISOString();

  return {
    isAmp,
    articleAuthor: config.articleAuthor,
    articleSection: metadata.passport.genre,
    brandName: config.brandName,
    canonicalLink,
    defaultImage: config.defaultImage,
    defaultImageAltText: config.defaultImageAltText,
    description: promo.summary,
    lang: metadata.passport.language,
    locale: config.locale,
    metaTags: allTags(metadata.tags),
    timeFirstPublished,
    timeLastUpdated,
    title: promo.headlines.seoHeadline,
    twitterCreator: config.twitterCreator,
    twitterSite: config.twitterSite,
    type: metadata.type,
  };
};

/*
  [1] This handles async data fetching, and a 'loading state', which we should look to handle more intelligently.
*/
const ArticleContainer = ({ loading, error, data }) => {
  if (loading) return 'Loading...'; /* [1] */
  if (error) return 'Something went wrong :(';
  if (data) {
    const { isAmp, data: articleData, service } = data;
    const { content, metadata, promo } = articleData;

    const { id: aresArticleId } = metadata;
    const id = aresArticleId.split(':').pop();
    const config = serviceConfig[service];

    return (
      <Fragment>
        <ServiceContextProvider service={service}>
          <Header />
          <Metadata
            {...metadataProps(isAmp, config, id, metadata, promo, service)}
          />
          <MainContent>
            <Blocks
              blocks={content.model.blocks}
              componentsToRender={componentsToRender}
            />
          </MainContent>
          <Footer />
        </ServiceContextProvider>
      </Fragment>
    );
  }

  return null;
};

ArticleContainer.propTypes = {
  loading: bool,
  error: string,
  data: shape(articlePropTypes),
};

ArticleContainer.defaultProps = {
  loading: false,
  error: null,
  data: null,
};

export default ArticleContainer;
