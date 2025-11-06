import React from "react";

const Appendix = ({ notes }) => {
  // Ép về mảng an toàn
  const safeNotes = Array.isArray(notes) ? notes : [];

  return (
    <section className="appendix">
      <h2>📑 Appendix / Technical Notes</h2>
      {safeNotes.length > 0 ? (
        <ul>
          {safeNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      ) : (
        <p>No technical notes available.</p>
      )}
    </section>
  );
};

export default Appendix;
