import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getManagedRestaurant, type GetManagedRestaurantResponse } from "@/api/get-managed-restaurant";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/api/update-profile";
import { toast } from "sonner";

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable()
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()
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
  function updateManagedRestaurantCache({ name, description }: StoreProfileSchema) {
    const cashed = queryClient.getQueryData<GetManagedRestaurantResponse>(['managed-restaurant'])
    if (cashed) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(['managed-restaurant'], {
        ...cashed,
        name,
        description,
      })
    }
    return { cashed }
  }
  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate: ({ name, description }) => {
      //onSuccess - funcao usada quando queremos actualizar os dados da tela (http state)
      //onMutate - funcao que dispara no clico do botao
      const { cashed } = updateManagedRestaurantCache({ name, description })
      return { previousProfile: cashed }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateManagedRestaurantCache(context.previousProfile)
      }
    },
  })
  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description
      })
      //interface otimista - é quando eu reago a alguma alteraçao do user mesmo antes 
      //da alteraçao actualizar no banco.

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
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="bg-red-600">Cancelar</Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}