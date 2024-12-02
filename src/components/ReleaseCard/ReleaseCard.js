import Card from '@site/src/components/Card/Card';
import { ArrowForward } from '@mui/icons-material';
import './ReleaseCard.css'

export default function ReleaseCard({ blogLink, releaseNotesLink, imageName, imageAltText }) {
  const imageSrc = imageName ? `/img/release-notes/${imageName}` : null;
  
  const footerContent = (
    <nav style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <a href={blogLink} target="_blank" style={{ display: 'flexbox', fontSize: '14px', fontWeight: 'bold' }}>
        Blog
        <ArrowForward sx={{ height: '10px', width: 'auto', paddingLeft: '1%' }} />
      </a>
      <a href={releaseNotesLink} style={{ display: 'flexbox', fontSize: '14px', fontWeight: 'bold' }}>
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
      imgLink={blogLink}
      footer={footerContent}
    />
  );
}