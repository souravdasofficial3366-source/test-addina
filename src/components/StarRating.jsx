import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, size = 14 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} color="var(--clr-star)" size={size} />);
  }
  if (hasHalf) {
    stars.push(<FaStarHalfAlt key="half" color="var(--clr-star)" size={size} />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} color="var(--clr-star-empty)" size={size} />);
  }

  return <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>{stars}</div>;
}
