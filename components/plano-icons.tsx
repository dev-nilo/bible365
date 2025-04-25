import { Book, Calendar, Clock, LayoutList } from "lucide-react"

type PlanIconProps = {
  planType: string
  className?: string
}

export function PlanIcon({ planType, className = "h-4 w-4" }: PlanIconProps) {
  switch (planType) {
    case "mcheyne":
      return <Calendar className={className} />
    case "mcheyne-sequencial":
      return <LayoutList className={className} />
    case "cronologico":
      return <Clock className={className} />
    case "capa-a-capa":
      return <Book className={className} />
    default:
      return <Calendar className={className} />
  }
}

export function getPlanColor(planType: string): { bg: string; text: string; darkBg: string; darkText: string } {
  switch (planType) {
    case "mcheyne":
      return {
        bg: "bg-sky-100",
        text: "text-sky-800",
        darkBg: "dark:bg-sky-900/30",
        darkText: "dark:text-sky-300",
      }
    case "mcheyne-sequencial":
      return {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        darkBg: "dark:bg-indigo-900/30",
        darkText: "dark:text-indigo-300",
      }
    case "cronologico":
      return {
        bg: "bg-amber-100",
        text: "text-amber-800",
        darkBg: "dark:bg-amber-900/30",
        darkText: "dark:text-amber-300",
      }
    case "capa-a-capa":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        darkBg: "dark:bg-emerald-900/30",
        darkText: "dark:text-emerald-300",
      }
    default:
      return {
        bg: "bg-sky-100",
        text: "text-sky-800",
        darkBg: "dark:bg-sky-900/30",
        darkText: "dark:text-sky-300",
      }
  }
}
