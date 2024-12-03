import Card from '@site/src/components/Card/Card';
import { ArrowForward } from '@mui/icons-material';
import './ReleaseCard.css'

export default function ReleaseCard({ blogLink, releaseNotesLink, imageName, imageAltText }) {
  const imageSrc = imageName ? `/img/release-notes/${imageName}` : null;
  
  const footerContent = (
    <nav className="release-card-footer">
      <a href={blogLink} target="_blank" className="release-card-button">
        Blog
        <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
      </a>
      <a href={releaseNotesLink} className="release-card-button">
        Release notes
        <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
      </a>
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