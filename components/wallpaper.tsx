export default function Wallpaper({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div
      className="absolute inset-0 bg-center transition-all duration-500"
      style={{
        backgroundImage: isDarkMode ? "url('/mojavi-night.jpg')" : "url('/mohave-day.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}
