"use client"

import { ChangeEvent, useState } from "react"
import styles from "./styles.module.scss"
import {UploadCloud} from "lucide-react"
import Image from "next/image"
import {Button} from "@/app/dashboard/components/button"
import {api} from "@/services/api"
import {cookiesGetClient} from "@/lib/cookieClient"
import {toast} from "sonner"
import {useRouter} from "next/navigation"

interface CategoryProps{
    id: string;
    name: string;
}

interface Props{
    categories: CategoryProps[]
}

export function Form({categories}: Props){
    const router = useRouter();

    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");

    async function HandleRegisterProduct(formData: FormData){

        const categoryIndex = formData.get("category");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");

        if(!categoryIndex || !name || !price || !description || !image){
            toast.warning("Preencha todos os campos!")
            return;
        }

        const data = new FormData();

        data.append("name", name);
        data.append("price", price);
        data.append("description", description);
        data.append("category_id", categories[Number(categoryIndex)].id);
        data.append("file", image);

        const token = cookiesGetClient();


        await api.post("/product", data, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .catch((err) => {
            console.log(err);
            toast.warning("Falha ao cadastrar esse produto!")
            return;
        })

        toast.success("Produto registrado com sucesso!")

        router.push("/dashboard")
           
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0];

            if(image.type !== "image/jpeg" && image.type !== "image/png"){
                toast.warning("Formato não permitido!")
                return;
            }

            setImage(image);
            setPreviewImage(URL.createObjectURL(image));
        }

    }


    return(
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form className={styles.form} action={HandleRegisterProduct}>
                <label className={styles.labelImage}>
                    <span>
                        <UploadCloud size={30} color="#fff"/>
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      required
                      onChange={handleFile}
                    />

                    {previewImage && (
                        <Image
                          alt="Imagem de Preview"
                          src={previewImage}
                          className={styles.preview}
                          fill={true}
                          quality={100}
                          priority={true}
                        />
                    )}

                </label>

                <select name="category" className={styles.select}>
                    {categories.map((list, index) => (
                        <option key={list.id} value={index}>
                            {list.name}
                        </option>
                    ))}
                </select>
                <input
                type="text"
                name="name"
                placeholder="Digite o nome do produto..."
                required
                className={styles.inputCategory}
                
                />

                <input
                type="text"
                name="price"
                placeholder="Preço do produto..."
                required
                className={styles.inputCategory}
                />

                <textarea
                className={styles.inputCategory}
                name="description"
                placeholder="Digite a descrição do produto..."
                required
                >

                </textarea>

                <Button
                name="Cadastrar produto"
                />


            </form>
        </main>
    )
}