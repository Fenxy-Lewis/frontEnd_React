import {Button} from "../components/ui/button";
import {Heart, Circle} from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"

interface ProductPrope {
    productId: number,
    productName: string,
    price: number,
    imageUrl: string;
    description: string
}

export function ProductCard({description, productName, price, imageUrl}: ProductPrope) {
    return (
        <div className="flex place-content-center">
            <Card className="w-[280px] h-[d place-420px] max-w-sm rounded-[18px] pb-8">
                <CardHeader className="gricontent-center flex-col place-content-center">
                    <Heart className="ml-[-5px] " fill="white" strokeWidth="1" size="30"/>
                    <img className="w-[180] h-[180px] mt-[-40px] object-cover" src={imageUrl}/>
                </CardHeader>

                <CardContent className="mb-4 mt-[-50px]">
                    <CardTitle>
                        <p className="nameProduct text-2xl font-bold text-center">{productName}</p>
                    </CardTitle>
                    <p className="text-[12px] text-center mt-[10px] text-gray-500">{description}</p>
                    <div className="flex place-content-center mt-[8px]">
                        <Circle size="22" fill="red" strokeWidth="0"/>
                        <Circle size="22" fill="green" strokeWidth="0"/>
                        <Circle size="22" fill="orange" strokeWidth="0"/>
                    </div>
                    <p className="text-center mt-[10px] text-3xl font-bold">{price} $</p>
                </CardContent>

                <CardFooter className="w-full mt-[-20px]">
                    <Button type="submit" className="w-full text-[8px] py-[22px] hover:bg-orange-500 hover:shadow-lg transition duration-300">
                        Add To Card
                    </Button>
                    {/*<Button className="w-50% bg-green-600 text-xs">*/}
                    {/*    View More*/}
                    {/*</Button>*/}
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProductCard;

// import React, { useState } from 'react'
// import { Heart, ShoppingCart, Star } from 'lucide-react'

// interface ProductCardProps {
//   id?: string
//   image: string
//   title: string
//   description?: string
//   price: number
//   originalPrice?: number
//   rating?: number
//   reviews?: number
//   onAddToCart?: () => void
//   onWishlist?: () => void
// }

// export function ProductCard({
//   image,
//   title,
//   description,
//   price,
//   originalPrice,
//   rating = 0,
//   reviews = 0,
//   onAddToCart,
//   onWishlist,
// }: ProductCardProps) {
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const discount = originalPrice
//     ? Math.round(((originalPrice - price) / originalPrice) * 100)
//     : 0

//   const handleWishlistClick = () => {
//     setIsWishlisted(!isWishlisted)
//     onWishlist?.()
//   }

//   return (
//     <div className="group w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-gray-100">
//       {/* Image Container */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//         />

//         {/* Discount Badge */}
//         {discount > 0 && (
//           <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
//             Save {discount}%
//           </div>
//         )}

//         {/* Wishlist Button */}
//         <button
//           onClick={handleWishlistClick}
//           className={`absolute top-4 left-4 rounded-full p-2.5 transition-all duration-300 backdrop-blur-md ${
//             isWishlisted
//               ? 'bg-rose-500/90 text-white'
//               : 'bg-white/80 hover:bg-white text-gray-700'
//           }`}
//           aria-label="Add to wishlist"
//         >
//           <Heart
//             className={`w-5 h-5 transition-all ${
//               isWishlisted ? 'fill-current' : ''
//             }`}
//           />
//         </button>

//         {/* Overlay on Hover */}
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
//       </div>

//       {/* Content */}
//       <div className="p-5 flex flex-col flex-grow">
//         {/* Title */}
//         <h3 className="text-base font-semibold text-gray-900 line-clamp-2 tracking-tight leading-snug">
//           {title}
//         </h3>

//         {/* Description */}
//         {description && (
//           <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
//             {description}
//           </p>
//         )}

//         {/* Rating */}
//         {rating > 0 && (
//           <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex gap-0.5">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`w-4 h-4 transition-colors ${
//                     i < Math.round(rating)
//                       ? 'fill-amber-400 text-amber-400'
//                       : 'text-gray-200'
//                   }`}
//                 />
//               ))}
//             </div>
//             {reviews > 0 && (
//               <span className="text-xs font-medium text-gray-600 ml-auto">
//                 ({reviews})
//               </span>
//             )}
//           </div>
//         )}

//         {/* Spacer */}
//         <div className="flex-grow" />

//         {/* Price */}
//         <div className="flex items-baseline gap-2 mt-4 pt-4 border-t border-gray-100">
//           <span className="text-2xl font-bold text-gray-900">
//             ${price.toFixed(2)}
//           </span>
//           {originalPrice && originalPrice > price && (
//             <span className="text-sm font-medium text-gray-400 line-through">
//               ${originalPrice.toFixed(2)}
//             </span>
//           )}
//         </div>

//         {/* Add to Cart Button */}
//         <button
//           onClick={onAddToCart}
//           className="w-full mt-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg active:scale-95"
//         >
//           <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
//           <span>Add to Cart</span>
//         </button>
//       </div>
//     </div>
//   )
// }
