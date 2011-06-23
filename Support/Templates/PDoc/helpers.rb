module PDoc
  module Generators
    module Html
      module Helpers
        module BaseHelper
          def layout_section(title = false, classname = false)
            output = "<section class=\"section #{classname if classname}\">"
            output << "<header><h1>#{title}</h1></header>" if title
            output << '<section class="contentView">'
          end

          def end_layout_section
            output = '</section>'
            output << '</section>'
          end

          def parse_description(description)
            description.gsub(/<li>([^\s]+)\s+\((.*)\):\s+(.*)<\/li>/, '<li><span class="argumentName">\1</span><span class="argumentTypes">\2</span><span class="argumentDescription">\3</span></li>')
          end
        end
        
        module LinkHelper
        end
        
        module CodeHelper
        end
        
        module MenuHelper
        end
      end
    end
  end
end