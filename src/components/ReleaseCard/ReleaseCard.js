import useBaseUrl from '@docusaurus/useBaseUrl';
import { ArrowForward } from '@mui/icons-material';
import Card from '@site/src/components/Card/Card';
import './ReleaseCard.css'

const RELEASE_PAGE_URL_PREFIX = '/release-notes/platform';

export default function ReleaseCard({ blogLink, releaseNotesLink, imageName, imageAltText }) {
  const relativeReleaseNoteLink = useBaseUrl(`${RELEASE_PAGE_URL_PREFIX}${releaseNotesLink}`);
  const imageSrc = imageName ? `/img/release-notes/${imageName}` : null;
  
  const footerContent = (
    <nav className="release-card-footer">
      { blogLink && (
        <a href={blogLink} target="_blank" title="Blog" className="release-card-button">
          Blog
          <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
        </a>
      )}
      { releaseNotesLink && (
        <a href={relativeReleaseNoteLink} title="Release notes" className="release-card-button">
          Release notes
          <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
        </a>
      )}
    </nav>
  )

  return (
    <Card 
      className="release-card"
      imageUrl={imageSrc}
      imageAlt={imageAltText}
      imageLink ={blogLink}
      footer={footerContent}
    />
  );
}