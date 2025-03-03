import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {getInitials} from '@/lib/string';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Skeleton} from '@/components/ui/skeleton';
import AvatarEditor from 'react-avatar-editor';
import {ImageUpscale, Pencil, RotateCwSquare} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Slider} from '@/components/ui/slider';

const AVATAR_DIMENSION = 340;
const MAX_ROTATION = 270;
const SCALE_RANGE = {min: 100, max: 500};

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

    const onClose = () => setFile(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) setFile(event.target.files[0]);
    };

    if (props.isPending) return <Skeleton
        className={`w-[${AVATAR_DIMENSION}px] h-[${AVATAR_DIMENSION}px] rounded-lg`} />;

    return (
        <div className={`relative w-[${AVATAR_DIMENSION}px] h-[${AVATAR_DIMENSION}px]`}>
            {!file && <DefaultAvatar {...props} handleFileChange={handleFileChange} />}
            {file && <AvatarUploadEditor image={file} onClose={onClose} />}
        </div>
    );
};

const DefaultAvatar = ({
                           username,
                           avatar,
                           handleFileChange,
                       }: UploadPictureFormLoaded & {
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}) => (
    <>
        <Avatar className={`relative w-[${AVATAR_DIMENSION}px] h-[${AVATAR_DIMENSION}px] rounded-lg cursor-pointer`}>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="text-8xl rounded-lg">{getInitials(username)}</AvatarFallback>
        </Avatar>
        <label
            className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Pencil className="w-12 h-12 text-white" />
        </label>
    </>
);

const AvatarUploadEditor = ({image, onClose}: {image: File; onClose: () => void}) => {
    const [scale, setScale] = useState<number>(SCALE_RANGE.min);
    const [rotate, setRotate] = useState<number>(0);
    const editorRef = useRef<AvatarEditor>(null);
    const parentRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleSave = () => {
        const canvas = editorRef.current?.getImageScaledToCanvas();
        if (canvas) {
            const dataURL = canvas.toDataURL();
            console.log('Image saved:', dataURL);
        }
    };

    const handleRotate = () => {
        setRotate((prev) => (prev + 90 > MAX_ROTATION ? 0 : prev + 90));
    };

    return (
        <div ref={parentRef} className="avatar-upload-editor">
            <AvatarEditor
                ref={editorRef}
                image={image}
                width={AVATAR_DIMENSION}
                height={AVATAR_DIMENSION}
                border={1}
                borderRadius={300}
                scale={scale / 100}
                rotate={rotate}
                color={[0, 0, 0, 0.6]}
                style={{border: '1px solid #ccc'}}
            />
            <div className="flex items-center gap-2 justify-center mt-1">
                <ImageUpscale className="w-3 h-3 text-muted-foreground" />
                <Slider
                    value={[scale]}
                    min={SCALE_RANGE.min}
                    max={SCALE_RANGE.max}
                    onValueChange={(e) => setScale(e[0])}
                />
                <ImageUpscale className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex gap-2 justify-center">
                <Button onClick={handleRotate} variant="secondary">
                    <RotateCwSquare /> +90°
                </Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    );
};

