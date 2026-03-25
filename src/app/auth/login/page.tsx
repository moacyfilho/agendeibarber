import { signIn } from "@/auth"
import { Scissors, Mail, Lock, ArrowRight } from "lucide-react"

export default async function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden text-white font-[family-name:var(--font-geist-sans)]">
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/10">
              <Scissors className="text-orange-500 w-10 h-10 -rotate-45" />
           </div>
           <h1 className="text-4xl font-black tracking-tighter mb-2">Painel Gestor</h1>
           <p className="text-zinc-500 font-medium">Faça login para gerenciar sua barbearia.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-zinc-900 p-10 rounded-[2.5rem] shadow-2xl">
           <form 
             action={async (formData) => {
               "use server"
               try {
                 await signIn("credentials", {
                   email: formData.get("email"),
                   password: formData.get("password"),
                   redirect: true,
                   redirectTo: "/dashboard"
                 })
               } catch (error) {
                 throw error;
               }
             }}
             className="space-y-6"
           >
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Profissional</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                      name="email"
                      type="email" 
                      required
                      placeholder="seu@email.com"
                      className="w-full bg-zinc-900 border border-zinc-800 h-14 pl-12 pr-4 rounded-2xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-zinc-700" 
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Senha</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                      name="password"
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-800 h-14 pl-12 pr-4 rounded-2xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-zinc-700" 
                    />
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                   type="submit" 
                   className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black h-16 rounded-2xl text-lg shadow-xl shadow-orange-950/20 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                 >
                    Acessar Dashboard
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </form>

           <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
              <p className="text-zinc-600 text-sm">
                Esqueceu o acesso? <span className="text-zinc-400 font-bold hover:text-orange-500 cursor-pointer transition-colors">Fale com o suporte</span>
              </p>
           </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">Powered by Agendei Barber</p>
        </div>
      </div>
    </div>
  )
}
