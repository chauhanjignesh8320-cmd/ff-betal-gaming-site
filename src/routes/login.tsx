import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, LogIn, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Logo } from '@/components/logo'
import { Coins } from '@/components/coin'
import { cdn } from '@/lib/img'

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Login or Register — FF_BETAL' }] }),
  component: LoginPage,
})

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className="h-12 rounded-none" {...props} />
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)

  function finish(msg: string) {
    setError(null)
    toast.success(msg)
    navigate({ to: '/profile' })
  }

  return (
    <div className="relative isolate min-h-[calc(100dvh-4rem)]">
      <img src={cdn('/img/mode-squad.png', 1200)} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/90 to-background" />
      <div className="mx-auto flex max-w-md flex-col px-4 py-12">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 font-display text-5xl leading-none">Enter the arena</h1>
          <p className="mt-1 text-sm text-muted-foreground">One account for the app and the website.</p>
        </div>

        <Tabs defaultValue="login" onValueChange={() => setError(null)} className="clip-angle border border-border bg-card/90 p-5 backdrop-blur sm:p-6">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-none">
            <TabsTrigger value="login" className="rounded-none font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5">
            <form
              noValidate
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const f = new FormData(e.currentTarget)
                if (!emailOk(String(f.get('email')))) return setError('Enter a valid email address.')
                if (String(f.get('password')).length < 6) return setError('Password must be at least 6 characters.')
                finish('Welcome back, survivor')
              }}
            >
              <Field id="login-email" name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
              <Field id="login-pass" name="password" label="Password" type="password" autoComplete="current-password" />
              {error && <ErrorLine msg={error} />}
              <Button type="submit" size="lg" className="clip-angle h-12 w-full rounded-none font-bold uppercase">
                <LogIn /> Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-5">
            <form
              noValidate
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                const f = new FormData(e.currentTarget)
                const name = String(f.get('name')).trim()
                if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return setError('Player name: 3–16 letters, numbers or underscores.')
                if (!emailOk(String(f.get('email')))) return setError('Enter a valid email address.')
                if (String(f.get('password')).length < 6) return setError('Password must be at least 6 characters.')
                if (!agree) return setError('Please accept the fair-play rules to continue.')
                finish(`Welcome to FF_BETAL, ${name}! 500 bonus coins added.`)
              }}
            >
              <Field id="reg-name" name="name" label="Player name" autoComplete="nickname" maxLength={16} />
              <Field id="reg-email" name="email" label="Email" type="email" autoComplete="email" inputMode="email" />
              <Field id="reg-pass" name="password" label="Password" type="password" autoComplete="new-password" />
              <div className="flex items-start gap-3">
                <Checkbox id="reg-agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
                <Label htmlFor="reg-agree" className="text-sm font-normal leading-snug text-muted-foreground">
                  I'm 13 or older and accept the fair-play rules. I understand coins are virtual and have no cash value.
                </Label>
              </div>
              {error && <ErrorLine msg={error} />}
              <Button type="submit" size="lg" className="clip-angle h-12 w-full rounded-none font-bold uppercase">
                <UserPlus /> Create account
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                New players get <Coins amount={500} className="text-gold" /> welcome coins.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ErrorLine({ msg }: { msg: string }) {
  return (
    <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
      <AlertTriangle className="size-4 shrink-0" /> {msg}
    </p>
  )
}
