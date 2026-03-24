import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Settings, Palette, MapPin, Camera, Phone, Clock, Save } from "lucide-react";
import { redirect } from "next/navigation";

async function getTenantForDashboard() {
  const tenant = await prisma.tenant.findFirst();
  return tenant;
}

async function updateBrandSettings(formData: FormData) {
  "use server";
  const tenantId = formData.get("tenantId") as string;
  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      brandColor: formData.get("brandColor") as string || "#f97316",
      address: formData.get("address") as string || null,
      instagramUrl: formData.get("instagramUrl") as string || null,
      whatsappPhone: formData.get("whatsappPhone") as string || null,
      openingHours: formData.get("openingHours") as string || "09:00-20:00",
    }
  });
  revalidatePath("/dashboard/configuracoes");
  redirect("/dashboard/configuracoes?saved=true");
}

export default async function ConfiguracoesPage() {
  const tenant = await getTenantForDashboard();
  if (!tenant) return <div className="text-white p-10 text-xl">Nenhum tenant encontrado.</div>;

  return (
    <div className="p-10 md:p-14 max-w-5xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 text-orange-500 mb-2">
          <Settings className="w-7 h-7" />
          <span className="font-black text-xs uppercase tracking-widest">Configurações</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Personalização da Marca</h1>
        <p className="text-zinc-500 mt-2 text-lg font-medium">Deixe a cara da sua barbearia no sistema.</p>
      </div>

      <form action={updateBrandSettings} className="space-y-8">
        <input type="hidden" name="tenantId" value={tenant.id} />

        {/* COR DA MARCA */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Palette className="text-orange-500 w-6 h-6" /> Cor Principal
          </h3>
          <div className="flex items-center gap-6">
            <input type="color" name="brandColor" defaultValue={tenant.brandColor || "#f97316"} className="w-20 h-20 rounded-2xl border-2 border-zinc-700 cursor-pointer bg-transparent" />
            <div>
              <p className="text-zinc-400 font-medium">Selecione a cor que será usada nos botões e elementos da sua página de agendamento.</p>
              <p className="text-zinc-600 text-sm mt-1">Cor atual: <span className="font-mono font-bold text-white">{tenant.brandColor || "#f97316"}</span></p>
            </div>
          </div>
        </div>

        {/* INFORMAÇÕES */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-[2rem] p-8 space-y-6">
          <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
            <MapPin className="text-orange-500 w-6 h-6" /> Informações do Estabelecimento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Endereço
              </label>
              <input type="text" name="address" defaultValue={tenant.address || ""} placeholder="Rua das Flores, 123 - Centro" className="w-full bg-zinc-900 border border-zinc-800 h-14 rounded-2xl px-5 text-white font-medium focus:outline-none focus:border-orange-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" /> Instagram
              </label>
              <input type="text" name="instagramUrl" defaultValue={tenant.instagramUrl || ""} placeholder="@suabarbearia" className="w-full bg-zinc-900 border border-zinc-800 h-14 rounded-2xl px-5 text-white font-medium focus:outline-none focus:border-orange-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </label>
              <input type="text" name="whatsappPhone" defaultValue={tenant.whatsappPhone || ""} placeholder="(11) 98888-7777" className="w-full bg-zinc-900 border border-zinc-800 h-14 rounded-2xl px-5 text-white font-medium focus:outline-none focus:border-orange-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Horário de Funcionamento
              </label>
              <input type="text" name="openingHours" defaultValue={tenant.openingHours || "09:00-20:00"} placeholder="09:00-20:00" className="w-full bg-zinc-900 border border-zinc-800 h-14 rounded-2xl px-5 text-white font-medium focus:outline-none focus:border-orange-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* BOTÃO SALVAR */}
        <button type="submit" className="w-full md:w-auto h-16 px-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-2xl text-white font-black text-lg shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
          <Save className="w-6 h-6" /> SALVAR CONFIGURAÇÕES
        </button>
      </form>
    </div>
  );
}
