// Tiny decorative shapes used all over the story.

export const HEART_D =
  'M12 21.2s-7.6-4.7-9.7-9.4C.8 8.3 3.2 4 7.3 4c2.1 0 3.6 1.1 4.7 2.7C13.1 5.1 14.6 4 16.7 4c4.1 0 6.5 4.3 5 7.8-2.1 4.7-9.7 9.4-9.7 9.4z'

export function HeartShape({ className = '', fill = 'currentColor', ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path d={HEART_D} fill={fill} />
    </svg>
  )
}

export function FlowerShape({ className = '', petal = '#F3B6CE', center = '#E9B872', ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="12" cy="6.4" rx="3.6" ry="5" fill={petal} transform={`rotate(${r} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="3" fill={center} />
    </svg>
  )
}

export function SparkleShape({ className = '', fill = 'currentColor', ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path d="M12 1.5c.8 5.6 3.9 9.2 10.5 10.5-6.6 1.3-9.7 4.9-10.5 10.5C11.2 16.9 8.1 13.3 1.5 12 8.1 10.7 11.2 7.1 12 1.5z" fill={fill} />
    </svg>
  )
}
