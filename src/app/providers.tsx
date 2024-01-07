import { UIProvider } from "@yamada-ui/react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <UIProvider>{children}</UIProvider>
}