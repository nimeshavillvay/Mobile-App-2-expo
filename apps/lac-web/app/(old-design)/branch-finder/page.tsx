import type { Metadata } from "next";
import React from "react";
import { MainTitle } from "../_components/main-title";
import type { BranchType } from "./branch-data";
import { branchData } from "./branch-data";

export const metadata: Metadata = {
  title: "Our Branches",
};

const Branch = ({
  branchData,
  children,
}: {
  readonly branchData: BranchType;
  readonly children: React.ReactNode;
}) => {
  return (
    <div className="border border-gray-300 bg-gray-200 p-6 shadow-gray-300 hover:bg-gray-300 hover:shadow-xl">
      <h3 className="mb-4 text-xl font-semibold">{children}</h3>
      <address>
        <ul>
          {branchData.address.map((address) => (
            <BranchAddress key={address}>{address}</BranchAddress>
          ))}

          {branchData.phone.map((phone) => (
            <BranchPhone key={phone.phoneNo} telRef={phone.link}>
              {phone.phoneNo}
            </BranchPhone>
          ))}

          {branchData.fax?.map((fax) => <BranchFax key={fax}>{fax}</BranchFax>)}
        </ul>
      </address>
    </div>
  );
};

const BranchAddress = ({
  children,
}: {
  readonly children: React.ReactNode;
}) => {
  return <li className="font-semibold">{children}</li>;
};

const BranchPhone = ({
  telRef,
  children,
}: {
  readonly telRef: string;
  readonly children: React.ReactNode;
}) => {
  return (
    <li className="w-fit text-blue-600 hover:text-blue-800 hover:underline">
      <a href={telRef}>{children}</a>
    </li>
  );
};

const BranchFax = ({ children }: { readonly children: React.ReactNode }) => {
  return <li>{children}</li>;
};

const BranchFinderPage = () => {
  return (
    <div className="container">
      <MainTitle className="mt-8">Our Branches</MainTitle>

      <p>
        If you are vision-impaired or have some other impairment covered by the
        Americans with Disabilities Act or a similar law, and you wish to
        discuss potential accommodations related to using this website, please
        contact Wurth Louis and Company Customer Service at{" "}
        <a
          href="tel:8004224389"
          className="text-blue-700 hover:text-blue-900 hover:underline"
        >
          (800) 422-4389
        </a>
        , and/or email <strong>CService@wurthlac.com</strong>.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-8 text-wrap break-words text-gray-600 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {branchData.map((branch) => (
          <Branch key={branch.branchName} branchData={branch}>
            {branch.branchName}
          </Branch>
        ))}
      </div>
    </div>
  );
};

export default BranchFinderPage;
