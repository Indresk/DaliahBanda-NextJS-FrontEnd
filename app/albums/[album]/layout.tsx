import Image from "next/image";

export default function AlbumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Sidebar de álbum */
  return (
    <div className="flex">
      <div className="albumCard basis-full md:basis-1/3 bg-primary  p-6 ">
        <div>
          <Image
            width={200}
            height={200}
            src="https://assets.daliahbanda.com/brand/logos/full/logo-daliah-vector-black-v1.webp"
            alt=""
            className="albumImage w-full h-auto  mb-4 aspect-square"
          />
        </div>
        <h1 className="text-5xl font-semibold text-white">{"Disco 1"}</h1>
        <h2 className="text-2xl mb-10 text-white">{"Frase Simple"}</h2>
        <h2 className="text-lg font-semibold text-white "> Sobre el album</h2>

        <p className="text-gray-300"></p>
      </div>
      <div className="basis-full md:basis-2/3 p-6">{children}</div>
    </div>
  );
}
