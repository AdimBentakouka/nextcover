import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {getInitials} from '@/lib/string';
import {type ChangeEvent, useEffect, useRef, useState} from 'react';
import {Skeleton} from '@/components/ui/skeleton';
import AvatarEditor from 'react-avatar-editor';
import {ImageUpscale, Pencil, RotateCwSquare} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Slider} from '@/components/ui/slider';


interface UploadPictureFormPending {
    isPending: true;
}

interface UploadPictureFormLoaded {
    isPending: false;
    username: string;
    avatar?: string;
}

type UploadPictureFormProps = UploadPictureFormPending | UploadPictureFormLoaded;

export const UploadPictureForm = (props: UploadPictureFormProps) => {

    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setFile(null); // Appelle la fonction lorsque la touche Échap est pressée
            }
        };

        // Ajout de l'écouteur d'événements
        window.addEventListener('keydown', handleKeyDown);

        // Nettoyage de l'écouteur lors du démontage du composant
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };


    if (props.isPending)
        return <Skeleton className="w-[340px] h-[340px] rounded-lg" />;

    return (
        <div className="relative w-[340px] h-[340px] ">
            {!file && <DefaultAvatar {...props} handleFileChange={handleFileChange} />}
            {file && <AvatarUploadEditor image={file} />}
        </div>
    );
};

const DefaultAvatar = ({username, avatar, handleFileChange}: UploadPictureFormLoaded & {
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}) => (
    <>
        <Avatar
            className="relative w-[340px] h-[340px]  rounded-lg cursor-pointer">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="text-8xl rounded-lg">
                {getInitials(username)}
            </AvatarFallback>
        </Avatar>
        <label
            className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <Pencil className="w-12 h-12 text-white" />
        </label>
    </>
);

const AvatarUploadEditor = ({image}: {image: File}) => {
    const [scale, setScale] = useState<number>(100);
    const [rotate, setRotate] = useState<number>(0);
    const editorRef = useRef<AvatarEditor>(null);

    const handleSave = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas(); // Récupère l'image visible comme Canvas
            const dataURL = canvas.toDataURL(); // Convertir en Data URL (base64)
            console.log('Image sauvegardée : ', dataURL);
            // Exemple : Vous pouvez envoyer cette chaîne Base64 à une API, ou l'afficher dans un aperçu
        }
    };

    const handleRotate = () => {
        setRotate((prev) => prev + 90 > 270 ? 0 : prev + 90);
    };

    return (
        <div className="avatar-upload-editor">
            <AvatarEditor
                ref={editorRef}
                image={image}
                width={340}
                height={340}
                border={0} // Bordure autour de l'image
                borderRadius={300} // Cercle total
                scale={(scale / 100)} // Zoom
                rotate={rotate}
                color={[0, 0, 0, 0.6]} // Couleur de fond
                style={{border: '1px solid #ccc'}}
            />

            {/* Contrôle du zoom */}

            <div className="flex items-center gap-2 justify-center mt-1">

                <ImageUpscale className="w-3 h-3 text-muted-foreground" />

                <Slider value={[scale]} min={100} max={500}
                        onValueChange={(e) => setScale(e[0])} />

                <ImageUpscale className="w-5 h-5 text-muted-foreground" />

            </div>
            <div className={'flex gap-2 justify-center '}>
                <Button onClick={() => handleRotate()} variant="secondary">
                    <RotateCwSquare />+90°
                </Button>

                <Button
                    onClick={handleSave}
                >
                    Sauvegarder
                </Button>
            </div>

        </div>


    );
};