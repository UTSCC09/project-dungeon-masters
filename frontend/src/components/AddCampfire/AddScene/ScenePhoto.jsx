import { forwardRef } from "react";


export const ScenePhoto = forwardRef(({url, faded, style, ...props}, ref) => {
    const inlineStyles = {
      opacity: faded ? '0.2' : '1',
      transformOrigin: '0 0',
      backgroundImage: `url("${url}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'grey',
      ...style,
    };
  
    return <div className="h-52 w-full" ref={ref} style={inlineStyles} {...props} />;
  });