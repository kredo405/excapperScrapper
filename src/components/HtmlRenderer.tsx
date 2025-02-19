import React from "react";

interface Props {
  htmlString: string | undefined;
}

const HtmlRenderer: React.FC<Props> = ({ htmlString }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString ?? "" }} />;
};

export default HtmlRenderer;
