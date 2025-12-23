import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/api/update-profile";
import { toast } from "sonner";

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string()
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity
  })//useQuery para operaçoes de busca
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? ''
    }
  })
  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile
  })
  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description
      })
      toast.success('Perfil actualizado com sucesso!')
    } catch (error) {
      toast.error('Falha ao actualizar o perfil, tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>Actualize as informaçoes do seu estabelecimento visíveis ao seu cliente</DialogDescription>
      </DialogHeader>
      <form action="" onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4  items-center gap-4">
            <Label className="text-right" htmlFor="name">Nome</Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>
          <div className="grid grid-cols-4  items-center gap-4">
            <Label className="text-right" htmlFor="description">Descrição</Label>
            <Textarea className="col-span-3" id="name" {...register('description')} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" className="bg-red-600">Cancelar</Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}