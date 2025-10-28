import { Helmet } from 'react-helmet-async';

const ProductMetaTags = ({ product }) => {
  if (!product) return null;

  const title = product.name || product.nombre ? `${product.name || product.nombre} | PROOMTB` : 'PROOMTB';
  const description = product.description || product.descripcion || 'Descubre nuestra selección de productos de ciclismo de montaña';
  
  // Obtener la URL de la imagen
  const getImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '';
  };

  let imageUrl = '';
  if (product.image_url) {
    imageUrl = getImageUrl(product.image_url);
  } else if (product.images && product.images.length > 0) {
    imageUrl = getImageUrl(product.images[0]);
  }
  
  // Si no hay imagen, usar una por defecto
  if (!imageUrl) {
    imageUrl = `${window.location.origin}/logo192.png`;
  } else if (!imageUrl.startsWith('http')) {
    // Si la URL es relativa, convertirla a absoluta
    imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  const url = window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default ProductMetaTags;