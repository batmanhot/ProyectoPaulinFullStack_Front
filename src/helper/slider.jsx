import { useState } from "react";

const images = [
    "https://placehold.org/600x300/FF0000/FFFFFF?text=Hola+Mundo",
    "https://placehold.org/600x300/FF0000/FFFFFF?text=Hola+Mundo",
    "https://placehold.org/600x300/FF0000/FFFFFF?text=Hola+Mundo",
    "https://placehold.org/600x300/FF0000/FFFFFF?text=Hola+Mundo",
    "https://placehold.org/600x300/FF0000/FFFFFF?text=Hola+Mundo"
];

//  "https://via.placeholder.com/600x300?text=Imagen+1",
//     "https://via.placeholder.com/600x300?text=Imagen+2",
//     "https://via.placeholder.com/600x300?text=Imagen+3",
//     "https://via.placeholder.com/600x300?text=Imagen+4",
//     "https://via.placeholder.com/600x300?text=Imagen+5",

//{/* <img src="https://placehold.org/300x200/cccccc/000000?text=Hola+Mundo" alt="Placeholder personalizado" /> */}

export default function Slider() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Imagen */}
            <img
                src={images[current]}
                alt={`Slide ${current}`}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
            />

            {/* Botón anterior */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-600"
            >
                ◀
            </button>

            {/* Botón siguiente */}
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-600"
            >
                ▶
            </button>

            {/* Indicadores */}
            <div className="flex justify-center mt-3 space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${index === current ? "bg-blue-500" : "bg-gray-400"
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
}
