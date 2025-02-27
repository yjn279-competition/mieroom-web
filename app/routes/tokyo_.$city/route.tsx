import { ShelterList } from './shelterList'

export default function CityDashboard() {
  if (typeof document === 'undefined') {
    return null
  }

  return (
    <div className="container h-100 m-4">
      <h1 className="text-2xl font-bold mb-4">区市町村ダッシュボード</h1>
      <div className="flex flex-row gap-4">
        <div className="basis-8/12 h-[calc(100dvh-9)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51882.300028334204!2d139.59330037055176!3d35.63650798575117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f38bdd6d8d61%3A0x4ebc10d2858da879!2z5p2x5Lqs6YO95LiW55Sw6LC35Yy6!5e0!3m2!1sja!2sjp!4v1737176334224!5m2!1sja!2sjp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          />
        </div>
        <div className="basis-4/12">
          <ShelterList />
        </div>
      </div>
    </div>
  )
}
